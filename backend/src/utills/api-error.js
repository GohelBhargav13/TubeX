class ApiError extends Error {
    constructor(StatusCode,Message,errors,stack){
        super(Message)
        this.StatusCode = StatusCode
        this.Message = Message
        this.errors = errors
        this.success = false

        if(stack){
            this.stack = stack
        }
    }
}

export default ApiError;