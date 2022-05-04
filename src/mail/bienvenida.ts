export function bienvenidaMail (name: string) {
    return `<div>
    <div style="display:block;">
       <div style="display:flex; justify-content:center; align-items: center;" ><img style="width:90px" src="https://res.cloudinary.com/markets-center/image/upload/v1650312012/htdz8e4zhdkdhxmrcxvh.png" alt="MC"> <h1>Bienvenido, ${name}</h1></div> 
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
       <h3 style="display:block">Te damos la bienvenida a Markets Center. El espacio en el que tienes la más grande variedad de productos al alcance de tu mano.</h3>
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
         <h3 style="display:block">¡Esperamos que disfrutes de esta experiencia!</h3>
    </div>
    <div style="display:flex; justify-content:flex-end">
        <p>Equipo de Markets Center</p>
    </div>
</div>`
}