
let CabDocumento = document.querySelector("#CabDocumento");

window.addEventListener("load", function (e) {
    axios.get("/GuardarController/DimeDocumento").then(function (response) {
        CabDocumento.innerHTML = response.data;
    })
})

let BtnAgregar = document.querySelector("#BtnAgregar");
let InputArticulo = document.querySelector("#Articulo");
let InputTipoIva = document.querySelector("#TipoIva");
let InputCantidad = document.querySelector("#Cantidad");
let InputPrecio = document.querySelector("#Precio");
let movimientos = document.querySelector("#movimientos");

let Guardar = document.querySelector("#Guardar");

Guardar.addEventListener("click", function (e) {
    e.preventDefault();
    let BaseIva = 0;
    let Base0 = 0;
    let Impuesto = 0;
    let Subtotal = 0
    let Total = 0;

    let mov = movimientos.querySelectorAll(".movimiento");
    if (mov.length <= 0) {
        alert("No hay movimientos que guardar");
        return;
    }
    let detalles = []
    for (let index = 0; index < mov.length; index++) {
        const element = mov[index];
        let DetNombre = element.querySelector(".nombre").innerText
        let DetPrecio = parseFloat(element.querySelector(".precio").innerText)
        let DetCantidad = parseFloat(element.querySelector(".cantidad").innerText)
        let DetTipoIva = parseFloat(element.querySelector(".tipoiva").innerText)
        let DetImpuesto = parseFloat(element.querySelector(".impuesto").innerText)
        let DetSubtotal = parseFloat(element.querySelector(".subtotal").innerText)
        let DetTotal = parseFloat(element.querySelector(".total").innerText)

        if (DetTipoIva > 0) {
            BaseIva += DetSubtotal;
        } else {
            Base0 += DetSubtotal;
        }
        Impuesto += DetImpuesto;
        Subtotal += DetSubtotal;
        Total += DetTotal;

        detalles.push(
            {
                Nombre: DetNombre,
                Precio: DetPrecio,
                Cantidad: DetCantidad,
                TipoIva: DetTipoIva,
                Impuesto: DetImpuesto,
                Subtotal: DetSubtotal,
                Total: DetTotal,
            }
        )
    }

    let cabecera = {
        BaseIva,
        Base0,
        Impuesto,
        Subtotal,
        Total,
        detalles,
        Id: CabDocumento.innerHTML
    }

    

    console.log(cabecera);
    console.log(JSON.stringify(cabecera));

    axios.post('/GuardarController/Create', cabecera)
        .then(function (response) {
            if (response.data == "1") {
                print()
                location.reload();
            }
        })
        .catch(function (error) {
            console.log(error);
        });

})


BtnAgregar.addEventListener("click", function (e) {
    e.preventDefault();

    let Articulo = InputArticulo.value;
    let TipoIva = InputTipoIva.value;
    let Cantidad = InputCantidad.value;
    let Precio = InputPrecio.value;

    if (Articulo == "" || TipoIva == "" || Cantidad <= 0 || Precio <= 0) {
        alert("Debe ingresar todos los campos correctamente");
        return;
    }

    let subtotal = parseFloat(Cantidad * Precio).toFixed(2);
    let impuesto = parseFloat(subtotal * (TipoIva / 100)).toFixed(2);
    let total = parseFloat(subtotal + impuesto).toFixed(2);

    let movimiento = document.createElement("tr")
    movimiento.classList.add("movimiento");

    let tdbutton = document.createElement("td");
    tdbutton.classList.add("no-print")
    let button = document.createElement("button");
    button.classList.add("btn")
    button.classList.add("btn-danger") 
    button.innerText = "X";

    tdbutton.append(button)

    button.addEventListener("click", function (e) {
        e.preventDefault();
        this.parentElement.parentElement.remove();
        DimeTotales(totales);
    })
    movimiento.append(tdbutton)

    let tdnombre = document.createElement("td");
    tdnombre.innerText = Articulo
    tdnombre.classList.add("nombre");
    movimiento.append(tdnombre)


    let tdprecio = document.createElement("td");
    tdprecio.innerText = Precio
    tdprecio.classList.add("precio");
    movimiento.append(tdprecio)


    let tdcantidad = document.createElement("td");
    tdcantidad.innerText = Cantidad
    tdcantidad.classList.add("cantidad");
    movimiento.append(tdcantidad)

    let tdsubtotal = document.createElement("td");
    tdsubtotal.classList.add("subtotal");
    tdsubtotal.innerText = subtotal
    movimiento.append(tdsubtotal)


    let tdTipoIva = document.createElement("td");
    tdTipoIva.innerText = TipoIva
    tdTipoIva.classList.add("tipoiva");
    movimiento.append(tdTipoIva)


    let tdimpuesto = document.createElement("td");
    tdimpuesto.classList.add("impuesto");
    tdimpuesto.innerText = impuesto
    movimiento.append(tdimpuesto)

    let tdtotal = document.createElement("td");
    tdtotal.classList.add("total");
    tdtotal.innerText = total
    movimiento.append(tdtotal)



    movimientos.append(movimiento)

    InputArticulo.value = "";
    InputTipoIva.value = 12;
    InputCantidad.value = "";
    InputPrecio.value = "";

    DimeTotales(totales);
})


function DimeTotales(funcion) {
    let mov = movimientos.querySelectorAll(".movimiento");
    let BaseIva = 0;
    let Base0 = 0;
    let Impuesto = 0;
    let Subtotal = 0
    let Total = 0;

    mov.forEach(element => {
        let DetPrecio = parseFloat(element.querySelector(".precio").innerText)
        let DetCantidad = parseFloat(element.querySelector(".cantidad").innerText)
        let DetTipoIva = parseFloat(element.querySelector(".tipoiva").innerText)
        let DetImpuesto = parseFloat(element.querySelector(".impuesto").innerText)
        let DetSubtotal = parseFloat(element.querySelector(".subtotal").innerText)
        let DetTotal = parseFloat(element.querySelector(".total").innerText)

        if (DetTipoIva > 0) {
            BaseIva += DetSubtotal;
        } else {
            Base0 += DetSubtotal;
        }
        Impuesto += DetImpuesto;
        Subtotal += DetSubtotal;
        Total += DetTotal;
    });
    funcion(Subtotal, BaseIva, Base0, Impuesto, Total)

}

function totales(Subtotal, BaseIva, Base0, Impuesto, Total) {
    var CabSubtotal = document.querySelector("#CabSubtotal");
    var CabBase12 = document.querySelector("#CabBase12");
    var CabBase0 = document.querySelector("#CabBase0");
    var CabImpuesto = document.querySelector("#CabImpuesto");
    var CabTotal = document.querySelector("#CabTotal");

    CabSubtotal.innerHTML = parseFloat(Subtotal).toFixed(2);
    CabBase12.innerHTML = parseFloat(BaseIva).toFixed(2);
    CabBase0.innerHTML = parseFloat(Base0).toFixed(2);
    CabImpuesto.innerHTML = parseFloat(Impuesto).toFixed(2);
    CabTotal.innerHTML = parseFloat(Total).toFixed(2);
}
