using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PracticaPrueba.Models;
using System.Buffers.Text;

namespace PracticaPrueba.Controllers
{
    public class GuardarController : Controller
    {
        public string conex = new SqlConnectionStringBuilder()
        {
            DataSource = @"MIGUEL\MIGUEL",
            InitialCatalog = "Prueba",
            UserID = "sa",
            Password = "12345",
            TrustServerCertificate = true
        }.ConnectionString;


        [Route("GuardarController/DimeDocumento")]
        [HttpGet]
        public int DimeDocumento()
        {
            using SqlConnection conn = new(conex);
            conn.Open();

            string query = "select isnull(max(id), 0) + 1 numero from Cabecera";
            int? numero = conn.ExecuteScalar<int>(query);
            return numero ?? 1;
        }


        [Route("GuardarController/Create")]
        [HttpPost]
        public ActionResult Create([FromBody] Cabecera datos)
        {
            bool error = false;


            using SqlConnection conn = new(conex);
            conn.Open();
           

            string queryCabecera = @$"INSERT INTO Cabecera (Id, Subtotal, BaseIva, Base0, Impuesto, Total) 
VALUES (@Id, @Subtotal, @BaseIva, @Base0, @Impuesto, @Total)";
            using var transaction = conn.BeginTransaction();
            int eje = conn.Execute(queryCabecera, new
            {
                datos.Id,
                datos.Subtotal,
                datos.BaseIva,
                datos.Base0,
                datos.Impuesto,
                datos.Total
            }, transaction);

            if (eje <= 0)
            {
                error = true;
            }

            if (error)
            {
                transaction.Rollback();
                return Json(0);
            }

            foreach (Detalle item in datos.Detalles)
            {
                string QueryMovimiento = @$"INSERT INTO Movimientos (Id, Nombre, Cantidad, Impuesto, Precio, Subtotal, TipoIva, Total)
values (@Id, @Nombre, @Cantidad, @Impuesto, @Precio, @Subtotal, @TipoIva, @Total)";

                int mov = conn.Execute(QueryMovimiento, new
                {
                    datos.Id,
                    item.Nombre,
                    item.Cantidad,
                    item.Impuesto,
                    item.Precio,
                    item.Subtotal,
                    item.TipoIva,
                    item.Total
                }, transaction);

                if (mov <= 0)
                {
                    error = true;
                    break;
                }
            }

            if (error)
            {
                transaction.Rollback();
                return Json(0);
            }

            transaction.Commit();
            return Json(1);
        }
    }
}
