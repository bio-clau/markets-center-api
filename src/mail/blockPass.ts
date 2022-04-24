export function blockPassMail(name: string, link: string){
    return `<div>
    <div style="display:block;">
       <div style="display:flex; justify-content:center; align-items: center;" ><img style="width:90px" src="https://res.cloudinary.com/markets-center/image/upload/v1650312012/htdz8e4zhdkdhxmrcxvh.png" alt="MC"> <h1>Hola ${name}</h1></div> 
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
       <h3 style="display:block">Se requiere que reestablezca su contraseña para poder seguir utilizando el servicio de Merkets Center.</h3>
    
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
         <h3 style="display:block">Para reestableces tu contraseña, dirijase a <a href=${link}>este link</a> </h3>
    </div>
    <div style="display:flex; justify-content:flex-end">
        <p>Markets Center</p>
    </div>
</div>`
}