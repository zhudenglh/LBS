package com.example.helloworldapp;

public class DataItem {
    private String title;
    private int number;
    private String imageUrl;

    public DataItem(String title, int number, String imageUrl) {
        this.title = title;
        this.number = number;
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public int getNumber() {
        return number;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}
