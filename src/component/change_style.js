import React from "react";
import "../styles.css";
import { QRCode } from "react-qrcode-logo";
import logo from "./dog.png";
import { TwitterPicker } from "react-color";
import "./change_style.css";

export default class change_style extends React.Component {
  state = {
    logoOpacity: this.props.style.logoOpacity,
    fgColor: this.props.style.fgCOlor,
    QRStyle: this.props.style.QRStyle
  };

  logoOpacityChange = () => {
    if (this.state.logoOpacity === 1) this.setState({ logoOpacity: 0 });
    else this.setState({ logoOpacity: 1 });
  };

  fgCOlor = ({ hex }) => {
    this.setState({ fgColor: hex });
  };
  QRStyle = () => {
    if (this.state.QRStyle === "dots") this.setState({ QRStyle: "qusquares" });
    else this.setState({ QRStyle: "dots" });
  };

  show_change_page = flag => {
    if (flag === 0) {
      this.props.fgCOlor(this.state.fgColor);
      this.props.logoOpacityChange(this.state.logoOpacity);
      this.props.QRStyle(this.state.QRStyle);
    } else {
      this.setState({
        logoOpacity: this.props.style.logoOpacity,
        fgColor: this.props.style.fgCOlor,
        QRStyle: this.props.style.QRStyle
      });
    }
    this.props.show_change_page();
  };
  render() {
    return (
      <div className="cover">
        <div className="flowpage">
          <div className="left">
            <QRCode
              value={this.props.data.UFT}
              enableCORS={true}
              size="150"
              logoImage={logo}
              logoOpacity={this.state.logoOpacity}
              qrStyle={this.state.QRStyle}
              fgColor={this.state.fgColor}
              logoWidth={100}
              logoHeight={100}
            />
          </div>

          <div className="changepage">
            <div className="row btn_row">
              <div className="DisplayLogo">
                <button
                  for="checkLogo"
                  onClick={() => this.logoOpacityChange()}
                >
                  要不要Logo
                </button>
              </div>
              <div className="QRShape">
                <button for="checkCircle" onClick={() => this.QRStyle()}>
                  換一下
                </button>
              </div>
            </div>

            <div className="row color_row">
              <div className="LogoColor">更改QRcode顏色</div>
              <TwitterPicker
                color={this.state.color}
                onChangeComplete={this.fgCOlor}
                className="twitterPicker"
              />
            </div>

            <div className="botton_row">
              <input
                type="submit"
                className="closePage check"
                onClick={() => this.show_change_page(0)}
                value="確定"
              />
              <input
                type="submit"
                className="closePage"
                onClick={() => this.show_change_page(1)}
                value="取消"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
