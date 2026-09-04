import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService } from '../services/eventos.service';
import { ToastrService } from 'ngx-toastr';

export interface PerguntaResposta {
    label: string;
    valor: string;
}

@Component({
    selector: 'app-modal-perguntas-respostas',
    templateUrl: './modal-perguntas-respostas.component.html',
})
export class ModalPerguntasRespostasComponent implements OnInit, OnChanges {

    @Input() isOpen: boolean = false;
    @Input() inscricao: any;

    @Output() close = new EventEmitter<void>();
    @Output() reenviar = new EventEmitter<{
        email: string,
        inscricao: any
    }>();

    form!: FormGroup;

    perguntasRespostas: PerguntaResposta[] = [];
    textoPerguntasRespostas:  string = '';
    carregando = false;

    constructor(
        private fb: FormBuilder,
        private eventoService: EventoService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {

        this.form = this.fb.group({
            email: ['', [
                Validators.required,
                Validators.email
            ]]
        });

    }

    ngOnChanges(changes: SimpleChanges): void {

        if (
            changes['isOpen']?.currentValue === true &&
            this.inscricao
        ) {
            this.carregarPerguntasRespostas();
        }

    }

    carregarPerguntasRespostas(): void {

        if (!this.inscricao?.codigoInscricao) {
            return;
        }

        this.carregando = true;

        this.perguntasRespostas = [];

        this.eventoService
            .getPerguntasRespostas(this.inscricao.id)
            .subscribe(
                (resultado: PerguntaResposta[]) => {

                    this.perguntasRespostas = resultado;
                    this.textoPerguntasRespostas = resultado
                        .map(x => `${x.label}: ${x.valor}`)
                        .join('\n');
                    this.carregando = false;

                },
                (error: any) => {

                    console.error(error);

                    this.carregando = false;

                    this.toastr.error(
                        'Não foi possível carregar as perguntas e respostas.'
                    );

                }
            );
    }

    fechar() {
        this.close.emit();
    }

    reenviarComprovante() {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const email = this.form.value.email;

        this.eventoService
            .getReenvioComprovante(
                this.inscricao.codigoInscricao,
                email
            )
            .subscribe(
                () => {

                    this.toastr.success(
                        'Comprovante reenviado com sucesso.'
                    );

                },
                (error: any) => {

                    console.log(error);

                    this.toastr.warning(
                        error.error?.message
                    );

                }
            );
    }
}