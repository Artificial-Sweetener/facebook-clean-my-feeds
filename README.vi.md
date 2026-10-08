# <img src="src/res/mop.svg" alt="mop" width="36"/> FB - Clean My Feeds

[![GreasyFork](https://img.shields.io/greasyfork/v/552339-fb-clean-my-feeds-5-05?label=GreasyFork)](https://greasyfork.org/en/scripts/552339-fb-clean-my-feeds-5-05) [![GreasyFork installs](https://img.shields.io/greasyfork/dt/552339-fb-clean-my-feeds-5-05?label=GreasyFork%20installs)](https://greasyfork.org/en/scripts/552339-fb-clean-my-feeds-5-05) [![License: GPL v3](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)

[English](README.md) | **Tiếng Việt**

Bạn đáng ra phải là người quyết định mình thấy gì trên mạng, nhưng Facebook cứ liên tục ném đủ thứ rác vào mặt bạn, đến mức gần như không thể theo dõi nổi bạn bè và những trang bạn thật sự quan tâm. "FB - Clean My Feeds" là chiếc xô lau nhà bạn kéo vào mỗi khi muốn giành lại quyền kiểm soát.

Đây là một userscript cho Tampermonkey hoặc Violentmonkey giúp chặn quảng cáo Facebook, ẩn bài viết gợi ý và dọn bảng tin Facebook cho gọn gàng hơn.

Ban đầu được tạo bởi **[zbluebugz](https://github.com/zbluebugz)** và đã được thử lửa ngoài thực tế từ năm 2021.

Xin cảm ơn **[trinhquocviet](https://github.com/trinhquocviet)** vì đã hỗ trợ duy trì bộ lọc trong năm 2025.

## <img src="src/res/import.svg" alt="install" width="36"/> Cài đặt

1. Cài một trình quản lý userscript như **[Violentmonkey](https://violentmonkey.github.io/)**, **[Tampermonkey](https://www.tampermonkey.net/)** hoặc **[FireMonkey](https://addons.mozilla.org/en-US/firefox/addon/firemonkey/)**.
2. Thêm script theo cách bạn thích:
   - Từ repo này: mở [`fb-clean-my-feeds.user.js`](https://raw.githubusercontent.com/Artificial-Sweetener/facebook-clean-my-feeds/main/fb-clean-my-feeds.user.js) rồi để trình quản lý userscript của bạn nhập vào.
   - Hoặc truy cập [trang phát hành trên GreasyFork](https://greasyfork.org/en/scripts/552339-fb-clean-my-feeds-5-05) và bấm **install this script**.
3. Tải lại Facebook. Bạn có thể để biểu tượng cây lau nhà xuất hiện ở góc dưới bên trái, góc trên bên phải, hoặc ẩn hẳn đi.

## <img src="src/res/check.svg" alt="features" width="36"/> Tính năng

"FB - Clean My Feeds" được tạo ra để giúp trải nghiệm lướt Facebook của bạn gọn hơn, yên hơn, và hoàn toàn nằm trong tay bạn.

- **Quét sạch quảng cáo:** Tự động chặn quảng cáo Facebook, dọn các bài "Sponsored", nhãn "Paid Partnership" và các mục "Suggested for you" trên News, Groups, Watch, Marketplace, Search và Reels.
- **Nhận diện nhãn đa ngôn ngữ:** Bộ lọc kết hợp bố cục Facebook được hỗ trợ với nhãn chính xác từ 23 bản dịch khi cần phân biệt đúng nút hoặc thành phần. Đổi ngôn ngữ của bảng cài đặt không làm thay đổi các nhãn được nhận diện. Nhãn mới hoặc cấu trúc trang chưa được hỗ trợ có thể bị bỏ sót.
- **Dẹp bớt AI cho đỡ mệt:** Ẩn thẻ "Try Meta AI", các gợi ý prompt của Meta AI, bài viết có nhãn "AI info" của Facebook, và mấy thứ gây xao nhãng ở panel bên cạnh trước khi chúng chiếm luôn feed của bạn. Bộ lọc "AI info" dựa vào nhãn của Facebook và không phát hiện mọi bài viết được tạo bằng AI.
- **Thu gọn bố cục:** Ẩn Reels, "Short Videos", và cả những dãy "Stories" to đùng chiếm hết màn hình. Bạn còn có thể tắt nguyên những khu như Marketplace nếu chẳng bao giờ dùng tới.
- **Lọc bớt ồn ào:** Tạo danh sách chặn theo từ hoặc cụm từ cụ thể (có hỗ trợ regex!). Bạn cũng có thể đặt ngưỡng số "Like" để bớt thấy những bài quá viral và giữ feed mang tính cá nhân hơn.
- **Dọn bảng tin Facebook cho đỡ phiền đầu:** Script sẽ loại bớt "People You May Know", gợi ý "Follow", khảo sát quảng bá, và các chiêu câu tương tác khác. Ngoài ra bạn còn có thể tạm dừng GIF và video tự phát để khỏi bị motion đập thẳng vào mắt.
- **Điều khiển dễ dàng:** Một menu cài đặt gọn gàng, đẹp mắt và hỗ trợ nhiều ngôn ngữ. Chỉ cần bấm biểu tượng cây lau nhà, bật những gì bạn muốn, và thấy kết quả ngay.

## <img src="src/res/pref.svg" alt="options" width="36"/> Cách dùng Bảng Điều Khiển

- Bấm biểu tượng cây lau nhà **Clean My Feeds** (hoặc mở từ menu của trình quản lý userscript) để mở hộp thoại cài đặt.
- Các tùy chọn được nhóm theo từng feed (News, Groups, Watch, Marketplace, Profiles, Search, Reels). Bật những gì bạn muốn, lưu lại, và script sẽ quét lại trang ngay lập tức.
- Bật **Debug** nếu muốn hiện các bài bị ẩn bằng viền chấm để bạn dễ kiểm tra thứ gì đang bị lọc.
- Dùng **Export / Import** để sao lưu cài đặt. Script lưu tùy chọn cục bộ; khi duyệt web ẩn danh/private, các thiết lập đó sẽ mất khi phiên kết thúc.
- Khi bật regex cho News, Groups, Watch hoặc Profiles, biểu thức không hợp lệ sẽ ngăn việc lưu hoặc nhập cài đặt. Thông báo lỗi chỉ rõ ô nhập gốc, dòng và feed bị ảnh hưởng; bản đang chỉnh sửa và cài đặt trước đó vẫn được giữ nguyên. Nếu cài đặt đã lưu từ trước chứa biểu thức không hợp lệ, script chỉ bỏ qua từng biểu thức đó để các quy tắc hợp lệ và bộ lọc khác tiếp tục hoạt động; hãy mở cài đặt để sửa. Marketplace vẫn khớp văn bản thông thường, không dùng regex.
- Kiểm tra cú pháp không đảm bảo thời gian chạy an toàn. Một regex hợp lệ nhưng tốn nhiều xử lý vẫn có thể làm treo tab, vì bản này dùng cơ chế khớp gốc của JavaScript và không thể ngắt giữa chừng. Bản thử nghiệm chạy regex trong Worker chưa được đưa vào vì chính sách bảo mật của Facebook chặn nguồn Worker đó.

### Hỗ trợ ngôn ngữ

Bảng điều khiển có nhiều bản địa hóa giao diện để phần cài đặt, nhãn và lý do ẩn bài vẫn rõ ràng ngay cả khi Facebook của bạn đang dùng ngôn ngữ khác.

<details>
  <summary>Ngôn ngữ được hỗ trợ</summary>

- English
- Português (Portugal & Brazil)
- Deutsch
- Français
- Español
- Čeština
- Tiếng Việt
- Italiano
- Latviešu
- Polski
- Nederlands
- עברית
- العربية
- Bahasa Indonesia
- 中文（简体）
- 中文（繁體）
- 日本語
- Suomi
- Türkçe
- Ελληνικά
- Русский
- Українська
- Български

</details>

Nếu bạn thấy chỗ nào dịch chưa ổn hoặc còn thiếu, cứ mở issue. Mình rất muốn phần giao diện này ngày càng mượt và dễ hiểu hơn cho người dùng không dùng tiếng Anh.

## <img src="src/res/bug.svg" alt="bugs" width="36"/> Đóng góp & Hỗ trợ

- **Issues & Features:** Cứ mở issue nếu có gì hỏng hoặc Facebook lại đổi markup thêm lần nữa. Mình có đọc.
- **Pull Requests:** Rất hoan nghênh. Giữ phạm vi gọn và mô tả rõ bạn đã sửa gì.
- **Translations:** Nếu bạn muốn giúp phần chữ trên giao diện sắc sảo hơn ở nhiều ngôn ngữ, mình rất sẵn lòng.

## Phát triển

Dùng Node **>=22.14.0 <23**; `.nvmrc` và CI cố định phiên bản **22.14.0**. Mã nguồn, kiểm thử và công cụ được viết bằng TypeScript với kiểm tra kiểu nghiêm ngặt. Userscript cài trên trình duyệt vẫn là một gói ES2018 độc lập, không cần tải thêm mã bên ngoài.

```sh
nvm use
npm ci
npm run verify
```

Nếu không dùng nvm, hãy cài phiên bản Node được hỗ trợ trước. Lệnh kiểm tra duy nhất này chạy kiểm tra định dạng, lint, kiểm tra kiểu riêng cho trình duyệt/lõi/công cụ/kiểm thử, các bài kiểm thử Jest, kiểm tra bản dịch và quy tắc dự án, rồi build và xác minh userscript. Lệnh cũng kiểm tra metadata, bảo đảm không có phụ thuộc mã chạy bên ngoài, tài nguyên gốc không bị sửa và kết quả build có thể tái tạo giống hệt nhau. Commit cả `fb-clean-my-feeds.user.js` đã build lại cùng thay đổi mã nguồn; đừng sửa trực tiếp tệp này.

Cả 17 biểu tượng đều được vẽ SVG thủ công, dùng màu theo giao diện khi hiển thị trong trang và màu sáng/tối phù hợp khi xuất hiện riêng trong tài liệu hoặc trình quản lý userscript. Quá trình dựng kiểm tra SVG chỉ chứa hình học tĩnh an toàn và giữ nguyên các PNG gốc để đối chiếu. Mô-đun vượt 350 dòng mã không tính chú thích sẽ được cảnh báo; vượt 500 dòng cần ngoại lệ đã được xem xét. Hàm có tên, phương thức, lớp và hợp đồng dữ liệu được xuất ra cần JSDoc có nội dung hữu ích. Xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết kiến trúc, ngoại lệ tạm thời và điều kiện phát hành. Giữ nội dung thiết yếu của README này đồng bộ với bản tiếng Anh.

## <img src="src/res/info.svg" alt="license" width="36"/> Giấy phép & Ghi công

- **License:** GNU General Public License v3.0, chỉ phiên bản 3 (GPL-3.0-only). Bạn được quyền chia sẻ, chỉnh sửa và cải tiến, miễn là vẫn giữ lại những quyền tự do đó cho người khác.
- **Original Project:** [facebook-clean-my-feeds](https://github.com/zbluebugz/facebook-clean-my-feeds) bởi [zbluebugz](https://github.com/zbluebugz)
- **Hỗ trợ duy trì bộ lọc (2025):** [trinhquocviet](https://github.com/trinhquocviet)
- **Current Maintainer:** [Artificial Sweetener](https://github.com/Artificial-Sweetener) - chính là mình!~

## <img src="src/res/about.svg" alt="about" width="36"/> Từ người duy trì

Mình hy vọng script này sẽ giúp bạn lấy lại feed của mình. Mình hứa sẽ đứng về phía bạn trong cuộc chiến chống lại những thứ bạn chẳng muốn phải thấy trên mạng.

- **Website & mạng xã hội của mình**: Bạn có thể xem tranh, thơ và những cập nhật dev khác của mình tại [artificialsweetener.ai](https://artificialsweetener.ai).
- **Nếu bạn thích dự án này**, mình sẽ rất trân trọng nếu bạn ghé cho nó một ngôi sao trên GitHub!! ⭐
