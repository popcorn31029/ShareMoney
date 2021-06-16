import React from "react";
import "../styles.css";
import "../component/list.css";
import { QRCode } from "react-qrcode-logo";
import logo from "./dog.png";
import ChangeStyle from "./change_style.js";

class App extends React.Component {
  state = {
    comment: "",
    showchangepage: "none",
    logoOpacity: "0",
    fgColor: "#000",
    QRStyle: "qusquares"
  };
  get_comment = comment => {
    if (comment.length <= 16) this.setState({ comment: comment });
    else {
      var temp = document.getElementById("comment");
      temp.value = this.state.comment;

      return;
    }
  };

  //  下載CRcode
  Combine_canvas = () => {
    var canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 500;
    var node = document.getElementById(this.props.data.qrcodeAmount);

    var qrcanvas = node.firstChild;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(qrcanvas, 0, 0, 400, 400);
    // 元
    var text = this.props.data.each_amount + "元";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "bold 50px Arial";
    ctx.fillText(text, 210, 430);
    // 備註
    text = this.state.comment;
    ctx.fillStyle = "#b5838d";
    ctx.font = "bold 25px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, 200, 470);
    return canvas;
  };

  downloadQR = () => {
    if (this.state.comment.length > 16) {
      alert("註解請不要超過16個字");
      return;
    }
    const canvas = this.Combine_canvas();
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    // img's name get date
    let date = new Date().toLocaleDateString();
    date = date.split("/");
    if (date[1].length === 1) date[1] = "0" + date[1];
    if (date[2].length === 1) date[2] = "0" + date[2];
    date = date[0] + date[1] + date[2];

    let time = new Date().toLocaleTimeString("it-IT");
    time = time.split(":");
    if (time[1].length === 1) time[1] = "0" + time[1];
    if (time[2].length === 1) time[2] = "0" + time[2];
    time = time[0] + time[1] + time[2];
    // img's name get date end

    // 下載的CODE
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "ShareMoney_" + date + time + ".png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    // 下載的CODE end
  };
  //  下載CRcodeEND
  // QRcode styple 改變
  logoOpacityChange = logoOpacity => {
    this.setState({ logoOpacity: logoOpacity });
  };
  fgCOlor = hex => {
    this.setState({ fgColor: hex });
  };
  QRStyle = QRStyle => {
    this.setState({ QRStyle: QRStyle });
  };
  // QRcode styple 改變 end

  //show QRcode STyle change page
  show_change_page = () => {
    if (this.state.showchangepage === "none") {
      this.setState({ showchangepage: "block" });
    } else {
      this.setState({ showchangepage: "none" });
    }
  };
  //show QRcode STyle change page end

  render = () => {
    return (
      <div className="QRcode">
        <div className="qrdoceWrapper">
          <div id={this.props.data.qrcodeAmount}>
            <QRCode
              value={this.props.data.UFT}
              style={{ width: 250, height: 250 }}
              enableCORS={true}
              logoImage={logo}
              size="240"
              logoOpacity={this.state.logoOpacity}
              qrStyle={this.state.QRStyle}
              fgColor={this.state.fgColor}
              logoWidth={100}
              logoHeight={100}
            />
          </div>

          <div class="action">
            <span className="annotation">
              {"收款金額為 : " + this.props.data.each_amount + "元"}
            </span>
            <span className="annotation">
              {"收款帳戶 : " + this.props.data.account}
            </span>
            <div className="noteWrapper">
              <span className="text">備註:</span>
              <input
                id="comment"
                className="note"
                type="text"
                placeholder="note"
                onChange={e => this.get_comment(e.target.value)}
              />
            </div>
            <br />

            <div className="btnWrapper">
              <button
                className="download_btn qrStyle"
                onClick={() => this.show_change_page()}
              >
                QR CODE樣式{" "}
              </button>
              <button
                className="download_btn"
                onClick={() => this.downloadQR()}
              >
                下載{" "}
              </button>
              <div style={{ display: this.state.showchangepage }}>
                <ChangeStyle
                  data={this.props.data}
                  style={this.state}
                  fgCOlor={this.fgCOlor.bind()}
                  QRStyle={this.QRStyle.bind()}
                  logoOpacityChange={this.logoOpacityChange.bind()}
                  show_change_page={this.show_change_page.bind()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
export default App;
