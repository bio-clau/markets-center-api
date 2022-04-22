const User = require("../models/User");
export async function checkoutMail(cart: any) {
  const user = await User.findById(cart.userId);
  const titulo = `<div style="display:block;">
     <div style="display:flex; justify-content:center; align-items: center;" ><img style="width:90px" src="https://res.cloudinary.com/markets-center/image/upload/v1650312012/htdz8e4zhdkdhxmrcxvh.png" alt="MC"> <h1>Tu compra número ${cart._id} de realizó con éxito</h1></div> 
    </div>`;
  const encabezado = `<h3 style="grid-column: 1; grid-row: 1;"></h3>
     <h3 style="grid-column: 2/4; grid-row: 1;">Producto</h3>
     <h3 style="grid-column: 4; grid-row: 1;">Precio unotario</h3>
     <h3 style="grid-column: 5; grid-row: 1;">Cantidad</h3>
     <h3 style="grid-column: 6; grid-row: 1;">Subtotal</h3>`;
  const final = `<div style="display:flex; justify-content:center; align-items: center;">
    <h3 style="display:block">¡Esperamos disfrutes tu compra!</h3>
    </div>
    <div style="display:flex; justify-content:flex-end">
   <p>Equipo de Markets Center</p>
    </div>`;
    let productList='';
    cart.products.map((p:any, i:number)=>{
        productList=`${productList}
        <h3 style="grid-column: 1; grid-row: ${i+2};"><img style="width:90px" src=${p.productId.image} alt="MC"></h3>
     <h3 style="grid-column: 2/4; grid-row: ${i+2};">${p.productId.name}</h3>
     <h3 style="grid-column: 4; grid-row: ${i+2};">${p.productId.price}</h3>
     <h3 style="grid-column: 5; grid-row: ${i+2};">${p.quantity}</h3>
     <h3 style="grid-column: 6; grid-row: ${i+2};">${p.productId.price*p.quantity}</h3>`
    })
    const msgCompleto=`${titulo}
    ${encabezado}
    <div style="display:grid; grid-template-columns:repeat(6, 150px);">
    ${productList}
    </div>
    ${final}`
    return msgCompleto
}
