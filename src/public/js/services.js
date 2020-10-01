/** Inserta los campos para las horas dependiendo de los servicios realizados **/
const amountServices = (data) => {
    const amount = parseInt(data.value)
    const containerFormTime = document.querySelector('.container--form__time')
    containerFormTime.innerHTML = ""

    for (let i = 0; i < amount; i++) {
        let line = `<label for="amount-services">Servicio ${i + 1}</label>
                    <input class="input time-start" type="time" id="time-start" required/>
                    <input class="input time-end" type="time" id="time-end" required/>`;
        let div = document.createElement("div");
        div.innerHTML = line;
        containerFormTime.appendChild(div);
    }
}

/**crea la estructura del reporte para hacer la peticion **/
const addServices = () => {
    const e = window.event
    e.preventDefault();
    const arrTimeSTart = []
    const arrTimeEnd = []
    const amountServices = document.getElementById('amount-services').value
    const idTecnico = document.getElementById('id-tecnico').value
    const idService = document.getElementById('service').value
    const date = document.getElementById('date').value
    const timeStart = document.getElementsByClassName('time-start')
    const timeEnd = document.getElementsByClassName('time-end')
    let returnValidHours = false

    if (amountServices === "") {
        swal("Faltan los servicios realizados durante el día", {
            icon: "info",
            timer: 4000,
            buttons: {},
        })
    } else {
        for (let i = 0; i < timeStart.length; i++) {
            if (validateHours(timeEnd[i].value, timeStart[i].value, i) === false) {
                break;
            } else {
                arrTimeSTart.push(timeStart[i].value)
                arrTimeEnd.push(timeEnd[i].value)
                returnValidHours = true
            }
        }
    }
    if (returnValidHours) {
        const service = {
            tecnico: idTecnico,
            service: idService,
            date,
            timeStart: arrTimeSTart,
            timeEnd: arrTimeEnd,
            completed: amountServices
        }
        if (validateFields(service)) {
            sendReport(service)
        }
    }
}

/** valida que la hora de inicio se menor que la hora final **/
const validateHours = (hourEnd, hourStart, i) => {
    if (hourEnd > hourStart) return true
    if (hourEnd < hourStart) {
        swal(`La hora de inicio del servicio ${i + 1} debe ser menor que la hora de finalización`, {
            icon: "info",
            timer: 4000,
            buttons: {},
        })
        return false
    }
}

/** valida que los campos no esten vacios **/
const validateFields = (service) => {
    let flag = true
    let field
    let serStart = []
    let serEnd = []
    if (service.tecnico === "") {
        flag = false
        field = "Id"
    }

    if (service.service === "") {
        flag = false
        field = "Servicio"
    }
    if (service.date === "") {
        flag = false
        field = "Fecha"
    }

    if (service.timeStart) {
        service.timeStart.forEach((st, i) => {
            if (st === "") {
                serStart.push(i)
            }
        })
    }
    if (service.timeEnd) {
        service.timeEnd.forEach((se, i) => {
            if (se === "") {
                serEnd.push(i)
            }
        })
    }

    if (flag === false) {
        swal(`El campo ${field} esta vacio`, {
            icon: "info",
            timer: 4000,
            buttons: {},
        })
    } else if (serStart.length !== 0) {
        swal(`El  servicio ${serStart[0] + 1} no tiene hora de inicio`, {
            icon: "info",
            timer: 4000,
            buttons: {},
        })
    } else if (serEnd.length !== 0) {
        swal(`El  servicio ${serEnd[0] + 1} no tiene hora de finalización`, {
            icon: "info",
            timer: 4000,
            buttons: {},
        })
    } else {
        return true
    }
}

/**realiza la peticion **/
const sendReport = async (repor) => {

    await fetch('http://localhost:5000/workHours/', {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(repor),
    })
        .then((res) => res.json())
        .then((response) => { 
                if (response.stored) {
                    swal(`Reporte almacenado con exito `, {
                        title: "Good job!",
                        icon: "success",
                        timer: 4000,
                        buttons: {},
                    })
                   
                    document.querySelector('.register__container--form').reset()
                } else {
                    swal(`${response.message} `, {
                        icon: "info",
                        timer: 4000,
                        buttons: {},
                    })
                }
            
            })
        .catch((err) => {
            console.error("Error enviando datos al backend: ", err);
        })
}