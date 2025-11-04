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
        setupClickListener(R.id.serviceClean, getString(R.string.service_clean));
        setupClickListener(R.id.serviceRepair, getString(R.string.service_repair));
        setupClickListener(R.id.serviceMoving, getString(R.string.service_moving));
        setupClickListener(R.id.serviceNanny, getString(R.string.service_nanny));

        // 生活维修
        setupClickListener(R.id.servicePhone, getString(R.string.service_phone));
        setupClickListener(R.id.serviceComputer, getString(R.string.service_computer));
        setupClickListener(R.id.serviceAppliance, getString(R.string.service_appliance));
        setupClickListener(R.id.servicePipe, getString(R.string.service_pipe));

        // 医疗健康
        setupClickListener(R.id.serviceConsult, getString(R.string.service_consult));
        setupClickListener(R.id.serviceMedicine, getString(R.string.service_medicine));
        setupClickListener(R.id.serviceCheckup, getString(R.string.service_checkup));
        setupClickListener(R.id.serviceRehab, getString(R.string.service_rehab));

        // 办公商务
        setupClickListener(R.id.serviceExpress, getString(R.string.service_express));
        setupClickListener(R.id.servicePrint, getString(R.string.service_print));
        setupClickListener(R.id.serviceBusiness, getString(R.string.service_business));
        setupClickListener(R.id.serviceMeeting, getString(R.string.service_meeting));
    }

    private void setupClickListener(int viewId, String serviceName) {
        View view = findViewById(viewId);
        if (view != null) {
            view.setOnClickListener(v -> {
                Toast.makeText(this, getString(R.string.opening_service_format, serviceName), Toast.LENGTH_SHORT).show();
            });
        }
    }
}
