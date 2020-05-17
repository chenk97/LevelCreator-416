package com.example.levelcreator.model;
import java.util.List;
public class Response {

    private String msg;
    private Object result;

    public Response(){super();}

    public Response(String msg, List<User> result) {
        this.msg = msg;
        this.result = result;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getResult() {
        return result;
    }

    public void setResult(Object result) {
        this.result = result;
    }

    //getters and setters

//    private String status;
//    private Object data;
//
//    public Response() {
//        super();
//    }
//
//    public Response(String status, Object data) {
//        this.status = status;
//        this.data = data;
//    }
//
//    public String getStatus() {
//        return status;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//
//    public Object getData() {
//        return data;
//    }
//
//    public void setData(Object data) {
//        this.data = data;
//    }
}
