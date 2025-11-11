import React from 'react';
import { Card, Empty } from 'antd';

const MessageList = () => {
  return (
    <Card title="消息列表" style={{ margin: '20px 0' }}>
      <Empty description="此页面由前端开发B负责实现" />
    </Card>
  );
};

export default MessageList;