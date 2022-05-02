export function desbannedMail (name: string, email: string, motivo: string ='Se cumplio el tiempo deteminado de baneo') {
    return `<div>
    <div style="display:block;">
       <div style="display:flex; justify-content:center; align-items: center;" ><img style="width:90px" src="https://res.cloudinary.com/markets-center/image/upload/v1650312012/htdz8e4zhdkdhxmrcxvh.png" alt="MC"> <h1>${name}, su cuenta fue desbloqueada recientemente</h1></div> 
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
       <h3 style="display:block">La cuenta con el email ${email} fue desbloqueada para permitir su utilizacion</h3>
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
         <h3 style="display:block">Motivo de desbloqueo: ${motivo}</h3>
    </div>
    <div style="display:flex; justify-content:flex-end">
        <p>Equipo de Markets Center</p>
    </div>
</div>`
}