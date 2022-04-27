export function blockPassMail(name: string, link: string){
    return `<div>
    <div style="display:block;">
       <div style="display:flex; justify-content:center; align-items: center;" ><img style="width:90px; vertical-align: middle;" src="https://res.cloudinary.com/markets-center/image/upload/v1650312012/htdz8e4zhdkdhxmrcxvh.png" alt="MC"><h3>Hola, ${name}</h3></div> 
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
       <p style="display:block">Se requiere que reestablezca su contraseña para poder seguir utilizando el servicio de Merkets Center.</p>
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
         <p style="display:block">Para reestablecer tu contraseña, dirijase a <a href=${link}>este link</a> </p>
    </div>
    <div style="display:flex; justify-content:flex-end">
        <p>Team Markets Center</p>
    </div>
</div>`
}