// 新增每人收款 以及 更改 set_total_amount 跟  set_number_of_people

import React from "react";
import "./styles.css";
import Select from "react-select";
import Switch from "react-switch";
import bankCode from "./BankCode";
import List from "./component/List";
import Cal from "./Calculator";
import DrawLot from "./component/drawLot";
class App extends React.Component {
  state = {
    ...bankCode,
    isRemainder: false,
    startTimer: true,
    coverpage: true,
    account: "",
    total_amount: "",
    each_amount: -1,
    bank_code: "009",
    number_of_people: 1,
    UFT: "",
    comment: "",
    onClickSwitch: false,
    isCalOn: false,
    isGenerate: false,
    qrcodeAmount: 0,
    qrCodeDataList: {},
    saveMany: {},
    drawLot: false
  };
  switchOnChange = (checked) => {
    if (checked === false) {
      this.setState({ qrCodeDataList: {}, qrcodeAmount: 0 });
    }

    this.setState({ onClickSwitch: checked });
  };
  set_account = (account) => {
    if (account.length <= 16) this.setState({ account: account });
    else {
      var temp = document.getElementById("account");
      temp.value = this.state.account;
      alert("轉帳帳號不得大於16位");
      return;
    }
  };
  set_total_amount = (amount) => {
    if (amount < 0) {
      alert("金額請大於0");
      return;
    }
    this.setState({ total_amount: amount });

    if (this.state.number_of_people !== "") {
      if (amount % this.state.number_of_people !== 0) {
        this.setState({
          isRemainder: true
        });
      } else {
        this.setState({
          isRemainder: false
        });
      }
    }
  };
  set_bank_code = (selectedOption) => {
    this.setState({
      bank_code: selectedOption.value,
      onSelect_bank_code: selectedOption
    });
  };
  set_number_of_people = (number) => {
    if (number < 0) {
      var temp = document.getElementById("number_of_people");
      temp.value = this.state.number_of_people;
      alert("平分人數至少為1人");
      return;
    } else this.setState({ number_of_people: number });
    if (this.state.total_amount !== "") {
      if (this.state.total_amount % number !== 0) {
        this.setState({
          isRemainder: true
        });
      } else {
        this.setState({
          isRemainder: false
        });
      }
    }
  };
  set_reload = () => {
    window.location.reload();
  };
  //計算機開關
  openCalculator = () => {
    if (this.state.isCalOn === true) {
      this.setState({ isCalOn: false });
    } else if (this.state.isCalOn === false) {
      this.setState({ isCalOn: true });
    }
  };
  //產生轉帳QR code
  generate_QRcode = () => {
    var str =
      "TWQRP://個人轉帳/158/02/V1?D1=" +
      this.state.each_amount +
      "00&D5=" +
      this.state.bank_code +
      "&D6=" +
      this.state.account +
      "&D10=901";
    var amount = this.state.qrcodeAmount;
    if (this.state.onClickSwitch === true) {
      let qrCodeDataList = this.state.qrCodeDataList;
      let newQRcodeData = {
        UFT: encodeURIComponent(str),
        each_amount: this.state.each_amount,
        qrcodeAmount: this.state.qrcodeAmount + 1,
        account: this.state.account
      };
      qrCodeDataList["qrcode_" + (amount + 1)] = newQRcodeData;
      //this.setState({ qrcodeAmount: amount + 1 });
      this.setState({ UFT: encodeURIComponent(str), qrcodeAmount: amount + 1 });
    } else {
      amount = 0;
      let qrCodeDataList = this.state.qrCodeDataList;
      let newQRcodeData = {
        UFT: encodeURIComponent(str),
        each_amount: this.state.each_amount,
        qrcodeAmount: this.state.qrcodeAmount,
        account: this.state.account
      };
      qrCodeDataList["qrcode_" + 0] = newQRcodeData;
      this.setState({ UFT: encodeURIComponent(str), qrcodeAmount: amount });
    }
  };
  //產生轉帳QR code END

  // 檢查資料
  check_data = (divide_type) => {
    if (this.state.bank_code === "") {
      alert("您的轉入行代碼為空白");
      return;
    }
    if (this.state.account === "") {
      alert("請填入匯款帳號");
      return;
    }
    if (this.state.total_amount === "") {
      alert("請填入金額");
      return;
    }
    if (this.state.number_of_people === "") {
      alert("請填入平分人數");
      return;
    }
    if (this.state.account.length > 16) {
      alert("帳號有誤請重新填寫");
      return;
    }
    // 確認帳號為16碼
    let account = this.state.account;
    while (account.length < 16) {
      account = "0" + account;
    }
    // 確認帳號為16碼 END

    // 均分價錢
    var each_amount;
    if (divide_type === 0) {
      each_amount = Math.floor(
        Number(this.state.total_amount) / Number(this.state.number_of_people)
      );
    } else {
      each_amount = Math.ceil(
        Number(this.state.total_amount) / Number(this.state.number_of_people)
      );
    }
    if (each_amount > 30000) {
      alert(
        " 每人單筆轉帳上限為3萬元\n 目前每人金額為" +
          each_amount +
          "\n 請確認您的人數或總金額"
      );
      return;
    }
    // 均分價錢 END
    this.setState(
      { account: account, each_amount: each_amount },
      this.generate_QRcode
    );
  };

  drawLotWindowToggle = () => {
    if (this.state.drawLot === false) {
      this.setState({ drawLot: true });
    } else {
      this.setState({ drawLot: false });
    }
  };
  render = () => {
    //console.log(this.state);
    let qrcode = Object.values(this.state.qrCodeDataList).map((data) => {
      return <List data={data} />;
    });
    return (
      <div className="App">
        <div
          className="calcover"
          style={{ display: this.state.isCalOn ? "block" : "none" }}
        />
        <div
          style={{ display: this.state.isCalOn ? "block" : "none" }}
          className="cal_wrapper"
        >
          <Cal
            set_total_amount={this.set_total_amount.bind()}
            openCalculator={this.openCalculator.bind()}
            isCalOn={this.state.isCalOn}
          />
        </div>
        <div className="main_wrapper">
          <div className="title" onClick={this.set_reload}>
            <img
              className="chb_logo"
              src="https://www.bankchb.com/frontend/img/CHB-pic(35).png"
              alt="chb_logo"
            />
            <div>
              <span
                style={{
                  marginRight: 10,
                  marginLeft: 5,
                  color: "red",
                  fontFamily: "Arial Narrow"
                }}
              >
                X
              </span>
              <span>Share Money</span>
            </div>
          </div>
          <div className="board">
            <div className="dataInput">
              <div className="account_wrapper">
                <span>收款帳號</span>
                <div className="account">
                  <Select
                    options={this.state.bankCode}
                    className="bankNo"
                    onChange={this.set_bank_code}
                    placeholder="銀行"
                    defaultValue={{ value: "009", label: "(009) 彰化商業銀行" }}
                    tabIndex="1"
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        width: 250
                      })
                    }}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "#ffc1bf",
                        primary: "rgba(255, 119, 114, 0.7)",
                        primary50: "#ffb2b0"
                      }
                    })}
                  />
                  <input
                    className="account_num inputer"
                    type="number"
                    placeholder="帳號"
                    onChange={(e) => this.set_account(e.target.value)}
                    tabIndex="2"
                    id="account"
                  />
                </div>
              </div>
              <div className="money_wrapper">
                <span>人數與金額</span>
                <div className="people_money">
                  <input
                    id="number_of_people"
                    type="number"
                    className="people_amount inputer"
                    placeholder="分帳人數"
                    onChange={(e) => this.set_number_of_people(e.target.value)}
                    tabIndex="3"
                  />
                  <div className="money_right">
                    <input
                      id="total_amount"
                      type="number"
                      className="money_count inputer"
                      placeholder="分帳金額"
                      onChange={(e) => this.set_total_amount(e.target.value)}
                      tabIndex="4"
                      value={this.state.total_amount}
                    />
                    <button className="cal" onClick={this.openCalculator} />
                  </div>
                </div>
              </div>
              <div className="action_wrapper">
                <div className="switch_wrapper">
                  <span>產生多筆</span>
                  <Switch
                    onChange={this.switchOnChange}
                    checked={this.state.onClickSwitch}
                    onColor="#00bcd5"
                  />
                </div>
                {/* 產生QRcode 的button */}
                <div className="data_btn_wrapper">
                  <button
                    className="create_btn btn"
                    onClick={() => this.check_data(0)}
                    style={{
                      display: this.state.isRemainder ? "none" : "block"
                    }}
                    disabled={
                      Math.floor(
                        this.state.total_amount / this.state.number_of_people
                      ) === 0 ||
                      this.state.account === "" ||
                      this.state.bank_code === "" ||
                      this.state.number_of_people === "0" ||
                      this.state.number_of_people === ""
                        ? true
                        : false
                    }
                  >
                    產生QR CODE
                  </button>
                  <div
                    className="payWay_btn_wrapper"
                    style={{
                      display: this.state.isRemainder ? "flex" : "none"
                    }}
                  >
                    <div className="payWay_btn">
                      <button
                        className="discount_btn btn"
                        style={{
                          display: this.state.isRemainder ? "inline" : "none"
                        }}
                        onClick={() => this.check_data(0)}
                        disabled={
                          Math.floor(
                            this.state.total_amount /
                              this.state.number_of_people
                          ) === 0 ||
                          this.state.account === "" ||
                          this.state.bank_code === "" ||
                          this.state.number_of_people === "0" ||
                          this.state.number_of_people === ""
                            ? true
                            : false
                        }
                      >
                        餘額捨去
                      </button>
                      <div
                        style={{
                          display: this.state.isRemainder ? "inline" : "none",
                          fontSize: 14,
                          marginTop: 5
                        }}
                      >
                        {Math.floor(
                          this.state.total_amount / this.state.number_of_people
                        )}
                        元
                      </div>
                    </div>
                    <div className="payWay_btn">
                      <button
                        style={{
                          display: this.state.isRemainder ? "inline" : "none"
                        }}
                        disabled={
                          Math.floor(
                            this.state.total_amount /
                              this.state.number_of_people
                          ) +
                            1 ===
                            0 ||
                          this.state.account === "" ||
                          this.state.bank_code === "" ||
                          this.state.number_of_people === "0" ||
                          this.state.number_of_people === ""
                            ? true
                            : false
                        }
                        className="incount_btn btn"
                        onClick={() => this.check_data(1)}
                      >
                        餘額進位
                      </button>
                      <div
                        style={{
                          display: this.state.isRemainder ? "inline" : "none",
                          fontSize: 14,
                          marginTop: 5
                        }}
                      >
                        {Math.floor(
                          this.state.total_amount / this.state.number_of_people
                        ) + 1}
                        元
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="qrcodeContainer">{qrcode}</div>
          </div>
          <div className="float_dot" onClick={this.drawLotWindowToggle}></div>

          <div
            className="draw_lots"
            style={{ display: this.state.drawLot ? "flex" : "none" }}
          >
            <div className="draw_header">幸運籤筒</div>
            <div className="draw_content">
              <DrawLot visable={this.state.drawLot} />
            </div>
          </div>
          <div
            className="cover"
            style={{
              display: this.state.drawLot ? "block" : "none",
              cursor: "pointer"
            }}
            onClick={this.drawLotWindowToggle}
          />
          <div className="footer">
            <div className="mamber_info">
              <span style={{ fontWeight: "900", fontSize: 14 }}>STAFF</span>
              <br />
              <span style={{ fontWeight: "700", marginLeft: 5 }}>
                {" "}
                NCU IPEECS 謝欣玉
              </span>
              <br />
              <span style={{ fontWeight: "700", marginLeft: 5 }}>
                {" "}
                FJCU MIIA 王志崴 陳怡安{" "}
              </span>
              <br />
              <span style={{ fontWeight: "700", marginLeft: 5 }}>
                {" "}
                FJCU CSIE 吳佩臻 秦嘉珮
              </span>
            </div>
            <a href="https://www.taiwanpay.com.tw/content/info/index.aspx">
              <img
                className="taiwanPay_logo"
                src="https://ddnwvj54yoeut.cloudfront.net/content/imgs/logo.png"
                alt="taiwanPay_logo"
              />
            </a>
          </div>
        </div>
      </div>
    );
  };
}
export default App;
