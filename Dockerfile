# Sử dụng image node chính thức phiên bản 20 làm image nền tảng
FROM node:20-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép toàn bộ mã nguồn ứng dụng vào container
COPY . .

# Cài đặt toàn bộ dependencies
RUN npm install

RUN npm install -g @nestjs/cli

# Biên dịch mã nguồn TypeScript sử dụng npx để tìm nest CLI
# RUN nest build

# Chạy lệnh để ứng dụng bắt đầu
# CMD ["node", "dist/main"]
CMD ["npm", "run", "start"]


