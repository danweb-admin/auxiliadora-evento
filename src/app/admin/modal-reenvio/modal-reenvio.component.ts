import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService } from '../services/eventos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-modal-reenvio',
    templateUrl: './modal-reenvio.component.html',
})
export class ModalReenvioComponent {
    
    @Input() isOpen: boolean = false;
    @Input() inscricao: any; // objeto da inscrição selecionada
    
    @Output() close = new EventEmitter<void>();
    @Output() reenviar = new EventEmitter<{ email: string, inscricao: any }>();
    
    form!: FormGroup;
    
    constructor(private fb: FormBuilder, 
        private eventoService: EventoService,
        private toastr: ToastrService
    ) {
        
    }
    
    ngOnInit() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }
    
    fechar() {
        this.close.emit();
    }
    
    reenviarComprovante() {
        if (this.form.invalid) return;
        
        const email = this.form.value.email;
        this.eventoService.getReenvioComprovante(this.inscricao.codigoInscricao, email).subscribe(() => {
            
            this.toastr.success('Comprovante reenviado com sucesso.');
        },
        (error: any) =>{
            console.log(error);
            this.toastr.warning(error.error?.message)
        });
    }
}
