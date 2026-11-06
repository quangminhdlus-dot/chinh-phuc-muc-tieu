# Chinh phục mục tiêu 12 tuần

Ứng dụng tiếng Việt bằng HTML, CSS và JavaScript thuần. Không cần tài khoản, máy chủ ứng dụng, cơ sở dữ liệu, thư viện hay dịch vụ trả phí.

## Xem thử

Cách nhanh: tải toàn bộ thư mục về máy, giữ ba tệp index.html, styles.css và app.js cùng thư mục rồi mở index.html bằng Chrome, Edge, Firefox hoặc Safari.

Để localStorage hoạt động ổn định theo cùng địa chỉ, nên chạy máy chủ cục bộ. Trong terminal:

```sh
cd chinh-phuc-muc-tieu
python3 -m http.server 8000 --bind 127.0.0.1
```

Chạy lệnh từ thư mục chứa dự án (hoặc thay đường dẫn cd bằng thư mục bạn vừa tải về). Mở http://localhost:8000 trong trình duyệt trên cùng máy chạy lệnh. Nhấn Ctrl+C để dừng. Lệnh này chỉ phục vụ trên máy cục bộ, không triển khai công khai.

Nếu bạn dùng VS Code, cũng có thể mở thư mục bằng VS Code và dùng tiện ích Live Server nếu đã cài. Không bắt buộc.

## Cách dùng

1. Nhập mục tiêu của bạn. Nội dung tự lưu sau mỗi lần nhập; nút “Lưu mục tiêu” xác nhận thao tác.
2. Nhập một công việc, chọn tuần từ 1 đến 12, bấm “Thêm việc” hoặc Enter.
3. Tích ô vuông để hoàn thành; bỏ tích để chuyển về cần làm.
4. Bấm dấu × cạnh công việc để xóa.
5. Dùng “Tất cả”, “Cần làm”, “Đã xong” để lọc. Tiến độ luôn tính trên toàn bộ công việc.
6. Các ô tuần chuyển xanh khi tuần đó có công việc và tất cả đều đã hoàn thành. Đây là trạng thái công việc, không phải tuần lịch hiện tại.

Tiến độ = số công việc đã hoàn thành / tổng công việc × 100, làm tròn đến số nguyên. Khi chưa có công việc, tiến độ bằng 0%.

## Vai trò các tệp

- index.html: cấu trúc trang, các biểu mẫu, danh sách công việc, thanh tiến độ và nhãn tiếng Việt.
- styles.css: màu sắc, kiểu chữ, bố cục, hiệu ứng và điều chỉnh màn hình nhỏ.
- app.js: thêm/xóa/hoàn thành công việc, lọc, tính tiến độ và tự lưu/khôi phục bằng localStorage.
- README.md: hướng dẫn chạy, sử dụng và giới hạn của bản đầu tiên.

Mã JavaScript có chú thích. Luồng chính: initialize() đọc dữ liệu và gắn sự kiện; các sự kiện thay đổi state; saveState() lưu dữ liệu; render() cập nhật giao diện.

## Dữ liệu

Khóa localStorage: chinh-phuc-12-tuan-v1. Dữ liệu gồm một mục tiêu (tối đa 500 ký tự) và danh sách công việc (mỗi tên tối đa 200 ký tự), tuần, trạng thái hoàn thành và mã định danh.

Dữ liệu chỉ thuộc trình duyệt và địa chỉ đang dùng; không đồng bộ giữa thiết bị. Xóa dữ liệu trang hoặc dùng chế độ riêng tư có thể làm mất dữ liệu. Khi mở bằng file://, cách lưu phụ thuộc trình duyệt; cách localhost ở trên đáng tin cậy hơn. Không đổi cổng/địa chỉ nếu muốn tiếp tục dùng cùng dữ liệu.

Nếu trình duyệt chặn localStorage hoặc bộ nhớ đầy, ứng dụng vẫn thao tác được trong phiên hiện tại và thông báo không lưu được. Nếu dữ liệu cũ bị hỏng, ứng dụng hiển thị thông báo; thao tác lưu tiếp theo sẽ thay thế dữ liệu cũ.

## Đã kiểm tra

- JavaScript vượt kiểm tra cú pháp node --check.
- Kiểm tra luồng sự kiện bằng Node.js với DOM và localStorage giả lập: mục tiêu tự lưu, chặn công việc trắng, thêm, xóa, hoàn thành/bỏ hoàn thành, lọc, khôi phục trạng thái khi khởi tạo lại, tiến độ 0/50/100%, tổng hợp tuần, dữ liệu bị hỏng và bộ nhớ bị chặn.
- Nội dung nhập được đưa vào textContent, không được thực thi thành HTML.
- Kiểm tra ID HTML không trùng và liên kết nhãn biểu mẫu hợp lệ.

Chưa kiểm thử trực quan trên trình duyệt thực hoặc thiết bị di động trong môi trường này vì không có công cụ trình duyệt được hỗ trợ. CSS có bố cục một cột dưới 700px; nên xem thử cả cửa sổ rộng và hẹp trên máy của bạn.

Ứng dụng chạy cục bộ. Pull Request chứa mã nguồn để kiểm tra; việc hợp nhất và triển khai do chủ kho quyết định.
