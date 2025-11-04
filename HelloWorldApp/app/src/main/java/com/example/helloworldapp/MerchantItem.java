package com.example.helloworldapp;

public class MerchantItem {
    private String name;
    private String location;
    private String distance;
    private String ownerName;
    private String imageUrl;
    private String sales;
    private String price;
    private String originalPrice;
    private String discount;
    private boolean hasDeal;

    public MerchantItem(String name, String location, String distance, String ownerName) {
        this.name = name;
        this.location = location;
        this.distance = distance;
        this.ownerName = ownerName;
        this.hasDeal = false;
    }

    public MerchantItem(String name, String location, String distance, String ownerName,
                       String sales, String price, String originalPrice, String discount) {
        this.name = name;
        this.location = location;
        this.distance = distance;
        this.ownerName = ownerName;
        this.sales = sales;
        this.price = price;
        this.originalPrice = originalPrice;
        this.discount = discount;
        this.hasDeal = true;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSales() {
        return sales;
    }

    public void setSales(String sales) {
        this.sales = sales;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(String originalPrice) {
        this.originalPrice = originalPrice;
    }

    public String getDiscount() {
        return discount;
    }

    public void setDiscount(String discount) {
        this.discount = discount;
    }

    public boolean hasDeal() {
        return hasDeal;
    }

    public void setHasDeal(boolean hasDeal) {
        this.hasDeal = hasDeal;
    }
}
