//Constructor del error

//Para la utilizacion del ErrorHandler, se debe usar la siguiente estructura:
//return next(new ErrorResponse("Lo que buscaste no existe", 404));

class ErrorResponse extends Error {
    statusCode:number;
    message:string;
    constructor(message:string, statusCode:number) {
        super()
        this.message= message;
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;