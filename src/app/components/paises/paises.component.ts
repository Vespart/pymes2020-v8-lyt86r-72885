import { Component, OnInit } from "@angular/core";
import { Pais } from "../../models/pais";
import { PaisesService } from "../../services/paises.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: "app-paises",
  templateUrl: "./paises.component.html",
  styleUrls: ["./paises.component.css"]
})
export class PaisesComponent implements OnInit {
  Titulo = "Paises";
  TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)"
  };
  AccionABMC = "L"; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: " No se encontraron registros...",
    RD: " Revisar los datos ingresados..."
  };

  Lista: Pais[] = [];
  RegistrosTotal: number;
  SinBusquedasRealizadas = true;

  Pagina = 1; // inicia pagina 1

  // opciones del combo activo
  OpcionesActivo = [
    { Id: null, Nombre: "" },
    { Id: true, Nombre: "SI" },
    { Id: false, Nombre: "NO" }
  ];

  FormReg: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private paisesService: PaisesService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormReg = this.formBuilder.group({
      IdPais: [0],
      Nombre: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(30)]
      ],
      FechaCenso: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}"
          )
        ]
      ],
      Poblacion: [0, [Validators.required, Validators.pattern("0|[0-9]")]]
    });
  }

  Agregar() {
    this.AccionABMC = "A";
    this.FormReg.reset({ Activo: true });
    this.submitted = false;
    //this.FormReg.markAsPristine();
    this.FormReg.markAsUntouched();
  }

  // Buscar segun los filtros, establecidos en FormReg
  Buscar() {
    this.SinBusquedasRealizadas = false;
    this.paisesService.get().subscribe((res: any) => {
      this.Lista = res;
    });
  }

  //Consultar(Dto) {
  //  this.BuscarPorId(Dto, "C");
  //}

  // comienza la modificacion, luego la confirma con el metodo Grabar
  //Modificar(Dto) {
  //  if (!Dto.Activo) {
  //    this.modalDialogService.Alert(
  //      "No puede modificarse un registro Inactivo."
  //    );
  //    return;
  //  }
  //  this.submitted = false;
  //  this.FormReg.markAsPristine();
  //  this.FormReg.markAsUntouched();
  //}

  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormReg.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormReg.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaCenso.substr(0, 10).split("/");
    if (arrFecha.length == 3)
      itemCopy.FechaCenso = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (itemCopy.IdPais == 0 || itemCopy.IdPais == null) {
      itemCopy.IdPais = 0;
      this.paisesService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert("Registro agregado correctamente.");
        this.Buscar();
      });
    } else {
      // modificar put
      //this.paisesService
      //  .put(itemCopy.IdArticulo, itemCopy)
      //  .subscribe((res: any) => {
      //    this.Volver();
      //    this.modalDialogService.Alert("Registro modificado correctamente.");
      //    this.Buscar();
      //  });
    }
  }

  // representa la baja logica
  //ActivarDesactivar(Dto) {
  //  this.modalDialogService.Confirm(
  //    "Esta seguro de " +
  //      (Dto.Activo ? "desactivar" : "activar") +
  //      " este registro?",
  //    undefined,
  //    undefined,
  //    undefined,
  //    () =>
  //      this.paisesService
  //        .delete(Dto.IdPais)
  //        .subscribe((res: any) => this.Buscar()),
  //    null
  //  );
  //}

  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }

  ImprimirListado() {
    this.modalDialogService.Alert("Sin desarrollar...");
  }
}
