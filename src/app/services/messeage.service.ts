import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class MesseageServices {
    $BOTTOM_RIGHT = "toast-bottom-right";

    constructor ( private toastr : ToastrService ){

    }

    messeageSuccess(mess?: string) : void{
        this.toastr.success(mess, "", {
            positionClass: this.$BOTTOM_RIGHT
        });
    }

    messeageWarning(mess?: string): void{
        this.toastr.warning(mess, "", {
            positionClass: this.$BOTTOM_RIGHT
        });
    }

    messeageError(mess?: string): void{
        this.toastr.error(mess, "", {
            positionClass: this.$BOTTOM_RIGHT
        });
    }

}