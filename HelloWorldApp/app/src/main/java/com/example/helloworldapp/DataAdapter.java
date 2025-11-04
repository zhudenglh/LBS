package com.example.helloworldapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;

public class DataAdapter extends BaseAdapter {
    private Context context;
    private List<DataItem> dataList;

    public DataAdapter(Context context, List<DataItem> dataList) {
        this.context = context;
        this.dataList = dataList;
    }

    @Override
    public int getCount() {
        return dataList.size();
    }

    @Override
    public Object getItem(int position) {
        return dataList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.item_data, parent, false);
        }

        DataItem item = dataList.get(position);

        ImageView imageView = convertView.findViewById(R.id.imageView);
        TextView titleText = convertView.findViewById(R.id.titleText);
        TextView numberText = convertView.findViewById(R.id.numberText);

        titleText.setText(item.getTitle());
        numberText.setText(context.getString(R.string.number_format, item.getNumber()));
        
        // 设置占位图片（灰色背景）
        imageView.setBackgroundColor(0xFFE0E0E0);

        return convertView;
    }

    public void updateData(List<DataItem> newData) {
        this.dataList = newData;
        notifyDataSetChanged();
    }
}
