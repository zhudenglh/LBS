package com.example.helloworldapp;

public class WiFiItem {
    private String ssid;
    private String tag;  // "official", "partner", "vip"
    private String note; // "可能需要认证", etc.
    private boolean isLocked;
    private int signalStrength; // 0-4
    private String capabilities; // Security type

    public WiFiItem(String ssid, String tag, String note, boolean isLocked, int signalStrength, String capabilities) {
        this.ssid = ssid;
        this.tag = tag;
        this.note = note;
        this.isLocked = isLocked;
        this.signalStrength = signalStrength;
        this.capabilities = capabilities;
    }

    public String getSsid() {
        return ssid;
    }

    public void setSsid(String ssid) {
        this.ssid = ssid;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void setLocked(boolean locked) {
        isLocked = locked;
    }

    public int getSignalStrength() {
        return signalStrength;
    }

    public void setSignalStrength(int signalStrength) {
        this.signalStrength = signalStrength;
    }

    public String getCapabilities() {
        return capabilities;
    }

    public void setCapabilities(String capabilities) {
        this.capabilities = capabilities;
    }

    public String getTagDisplay() {
        if (tag == null) return null;
        switch (tag) {
            case "official":
                return "官方";
            case "partner":
                return "合作";
            case "vip":
                return "会员专享";
            default:
                return tag;
        }
    }
}
