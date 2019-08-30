import Range from "./Range";

export default class DisableBIOS extends Range {
  biosDisabled: boolean = false;
  onBIOSDisabled: () => void;

  read(address: number) {
    return this.biosDisabled ? 1 : 0;
  }

  write(address: number, value: number) {
    this.biosDisabled = true;
    if (this.onBIOSDisabled) this.onBIOSDisabled();
  }
}