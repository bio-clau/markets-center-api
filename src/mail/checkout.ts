const User = require("../models/User");
export function checkoutMail(cart: any) {
   const titulo = `<div><img style="width: 90px;" src="https://res.cloudinary.com/markets-center/image/upload/v1650312012/htdz8e4zhdkdhxmrcxvh.png" alt="MC"/><h1>Tu compra número 123 de realizó con éxito</h1></div>`;
   let productos = ``
   cart.products.map((element: any) => {
      productos = `${productos}
      <tr>
          <td>
            <img style=" width: 50px; border-radius: 50px; margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;" src=${element.productId.image} alt=${element.productId.name} />
          </td>
          <td style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;">${element.productId.name}</td>
          <td style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;">${element.productId.price}</td>
          <td style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;">${element.quantity}</td>
          <td style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;">${element.productId.price * element.quantity}</td>
        </tr>`
   })
   const encabezado = `<table style="width: 80%; margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse;">
   <thead>
     <tr>
       <th style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;" >Producto</th>
       <th style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;" >Nombre</th>
       <th style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;" >Precio unitario</th>
       <th style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;" >Cantidad</th>
       <th style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;" >Subtotal</th>
     </tr>
   </thead>
   <tbody>
   ${productos}
   </tbody>
   <tfoot>
     <td style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;"></td>
     <td style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;"></td>
     <td style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;"></td>
     <th style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;">Total</th>
     <th style="margin-left: auto; margin-right: auto; border: 1px solid black; border-collapse: collapse; padding: 10px;">${cart.amount}</th>
   </tfoot>
 </table>`;
   const final = `<div style="display:flex; justify-content:center; align-items: center;">
        <h3 style="display:block">¡Esperamos disfrutes tu compra!</h3>
        </div>
        <div style="display:flex; justify-content:flex-end">
       <p>Equipo de Markets Center</p>
        </div>`;
   const msgCompleto = `<div style="<div style="display:block;">${titulo}
        ${encabezado}
        ${final}</div>`

   return msgCompleto

   //   const titulo = `<div style="display:block;">
   //      <div style="display:flex; justify-content:center; align-items: center;" ><img style="width:90px" src="https://res.cloudinary.com/markets-center/image/upload/v1650312012/htdz8e4zhdkdhxmrcxvh.png" alt="MC"> <h1>Tu compra número ${cart._id} de realizó con éxito</h1></div> 
   //     </div>`;
   //   const encabezado = `<h3 style="grid-column: 1; grid-row: 1;"></h3>
   //      <h3 style="grid-column: 2/4; grid-row: 1;">Producto</h3>
   //      <h3 style="grid-column: 4; grid-row: 1;">Precio unotario</h3>
   //      <h3 style="grid-column: 5; grid-row: 1;">Cantidad</h3>
   //      <h3 style="grid-column: 6; grid-row: 1;">Subtotal</h3>`;
   //   const final = `<div style="display:flex; justify-content:center; align-items: center;">
   //     <h3 style="display:block">¡Esperamos disfrutes tu compra!</h3>
   //     </div>
   //     <div style="display:flex; justify-content:flex-end">
   //    <p>Equipo de Markets Center</p>
   //     </div>`;
   //     let productList='';
   //     cart.products.map((p:any, i:number)=>{
   //         productList=`${productList}
   //         <h3 style="grid-column: 1; grid-row: ${i+2};"><img style="width:90px" src=${p.productId.image} alt="MC"></h3>
   //      <h3 style="grid-column: 2/4; grid-row: ${i+2};">${p.productId.name}</h3>
   //      <h3 style="grid-column: 4; grid-row: ${i+2};">${p.productId.price}</h3>
   //      <h3 style="grid-column: 5; grid-row: ${i+2};">${p.quantity}</h3>
   //      <h3 style="grid-column: 6; grid-row: ${i+2};">${p.productId.price*p.quantity}</h3>`
   //     })
   //     const msgCompleto=`${titulo}
   //     ${encabezado}
   //     <div style="display:grid; grid-template-columns:repeat(6, 150px);">
   //     ${productList}
   //     </div>
   //     ${final}`
   //     return msgCompleto
}
