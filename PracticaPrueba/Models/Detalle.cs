namespace PracticaPrueba.Models
{
    public class Detalle
    {
        public string Nombre { get; set; } = string.Empty;
        public float Cantidad { get; set; }
        public float Impuesto { get; set; }
        public float Precio { get; set; }
        public float Subtotal { get; set; }
        public int TipoIva { get; set; }
        public float Total { get; set; }

    }
}
