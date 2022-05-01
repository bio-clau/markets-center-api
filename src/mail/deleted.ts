export function deletedMail (name: string, email: string) {
    return `<div>
    <div style="display:block;">
       <div style="display:flex; justify-content:center; align-items: center;" ><img style="width:90px" src="https://res.cloudinary.com/markets-center/image/upload/v1650312012/htdz8e4zhdkdhxmrcxvh.png" alt="MC"> <h1>${name}, lamentamos informarle que su cuenta fue eliminada.</h1></div> 
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
       <h3 style="display:block">La cuenta con el email ${email} fue eliminada permanentemente.</h3>
    </div>
    <div style="display:flex; justify-content:center; align-items: center;">
         <h3 style="display:block">Para la recuperacion de la misma comuniquese con Markets Center.</h3>
    </div>
    <div style="display:flex; justify-content:flex-end">
        <p>Equipo de Markets Center.</p>
    </div>
</div>`
}