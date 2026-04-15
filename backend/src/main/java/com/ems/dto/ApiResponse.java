package com.ems.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    public static final String STATUS_SUCCESS = "SUCCESS";
    public static final String STATUS_ERROR = "ERROR";

    private T data;
    private String message;
    private String status;

    public ApiResponse() {}

    public ApiResponse(T data, String message, String status) {
        this.data = data;
        this.message = message;
        this.status = status;
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(data, "OK", STATUS_SUCCESS);
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(data, message, STATUS_SUCCESS);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(null, message, STATUS_ERROR);
    }

    public static <T> ApiResponse<T> error(T data, String message) {
        return new ApiResponse<>(data, message, STATUS_ERROR);
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
