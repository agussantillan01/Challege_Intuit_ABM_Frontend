import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function abrir_Alerta(mensaje, icono, foco=''){ 
    onFocus(foco);
    const MySwal = withReactContent(swal);
    MySwal.fire({ 
        title:mensaje, 
        icon:icono
    });
}

function onFocus(foco){ 
    if(foco!== ''){ 
        document.getElementById(foco).focus();
    }
}