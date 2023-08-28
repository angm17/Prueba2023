
CREATE DATABASE Prueba;
GO

USE Prueba;

GO

CREATE TABLE Cabecera (
	Id INT NOT NULL PRIMARY KEY, 
	Subtotal NUMERIC(20,4), 
	BaseIva NUMERIC(20,4), 
	Base0 NUMERIC(20,4), 
	Impuesto NUMERIC(20,4), 
	Total NUMERIC(20,4)
);

GO

CREATE TABLE Movimientos (
	Id INT NOT NULL FOREIGN KEY REFERENCES Cabecera (id), 
	Nombre varchar(max), 
	Cantidad NUMERIC(20,4), 
	Impuesto NUMERIC(20,4), 
	Precio NUMERIC(20,4), 
	Subtotal NUMERIC(20,4), 
	TipoIva NUMERIC(20,4), 
	Total NUMERIC(20,4)
);

GO