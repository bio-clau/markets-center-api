//Constructor del error

//Para la utilizacion del ErrorHandler, se debe usar la siguiente estructura:
//return next(new ErrorResponse("Lo que buscaste no existe", 404));

class ErrorResponse extends Error {
    statusCode:number;
    constructor(message:string, statusCode:number) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;