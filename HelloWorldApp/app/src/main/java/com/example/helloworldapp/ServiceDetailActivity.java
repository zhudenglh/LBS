package com.example.helloworldapp;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class ServiceDetailActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_service_detail);

        // 返回按钮
        ImageView backButton = findViewById(R.id.backButton);
        backButton.setOnClickListener(v -> finish());

        // 设置各个服务项的点击事件
        setupServiceItems();
    }

    private void setupServiceItems() {
        // 家政服务
        setupClickListener(R.id.serviceClean, "清洁服务");
        setupClickListener(R.id.serviceRepair, "维修服务");
        setupClickListener(R.id.serviceMoving, "搬家服务");
        setupClickListener(R.id.serviceNanny, "月嫂育儿");

        // 生活维修
        setupClickListener(R.id.servicePhone, "手机维修");
        setupClickListener(R.id.serviceComputer, "电脑维修");
        setupClickListener(R.id.serviceAppliance, "家电清洗");
        setupClickListener(R.id.servicePipe, "管道服务");

        // 医疗健康
        setupClickListener(R.id.serviceConsult, "在线问诊");
        setupClickListener(R.id.serviceMedicine, "药品配送");
        setupClickListener(R.id.serviceCheckup, "体检预约");
        setupClickListener(R.id.serviceRehab, "康复护理");

        // 办公商务
        setupClickListener(R.id.serviceExpress, "快递服务");
        setupClickListener(R.id.servicePrint, "打印复印");
        setupClickListener(R.id.serviceBusiness, "商务服务");
        setupClickListener(R.id.serviceMeeting, "会议服务");
    }

    private void setupClickListener(int viewId, String serviceName) {
        View view = findViewById(viewId);
        if (view != null) {
            view.setOnClickListener(v -> {
                Toast.makeText(this, "正在打开" + serviceName, Toast.LENGTH_SHORT).show();
            });
        }
    }
}
