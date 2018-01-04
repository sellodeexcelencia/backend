## Sello de Excelencia Gobierno Digital Colombia
Aplicación que permite postular, validar y certificar la alta calidad de los trámites, servicios, productos y capacidades de gestión de TI de las entidades públicas del Estado Colombiano.

* [http://sellodeexcelencia.gov.co](http://sellodeexcelencia.gov.co/)

## Requisitos
  1. Node.js version 4 o superior.
	2. Mysql version 5.6 o superior.
	3. Google Cloud SDK

## Instalación
Clonar el Repositorio
```shell
  $ git clone https://github.com/sellodeexcelencia/backend.git
  $ cd Sello-de-Excelencia-Backend
  $ npm install
  $ gcloud init
```

```shell
  $ mysql -u root -p
  $ > create database stamp
  $ > quit;
  $ mysql -u root -p stamp < ./design/database.sql
```


## Ejecución
```shell
  $ npm start
```
Al finalizar de ejecutar este comando (**npm run build**) los archivos listos para producción estaran dentro del directorio ```dist``` ubicado en la raíz del proyecto.
