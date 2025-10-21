class ApiResponse {
    constructor(StatusCode,data,message){
        this.StatusCode = StatusCode
        this.data = data
        this.message = message
        this.success = true
    }
}

export default ApiResponse;