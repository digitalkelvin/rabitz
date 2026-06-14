import { For, Show } from "solid-js";
import { DeviceSelectProps } from "../models/models";

export function DeviceSelect(props: DeviceSelectProps) {
  return (
    <Show
      when={props.devices().length > 0 || props.value() === "none"}
      fallback={
        <select disabled>
          <option>{props.placeholder ?? "Loading..."}</option>
        </select>
      }
    >
      <select id={props.id} value={props.value()} onChange={props.onChange} disabled={props.disabled}>
        <For each={props.devices()}>{(d) => <option value={d.deviceId}>{d.label}</option>}</For>
        <option value="none">{props.offLabel ?? "Off"}</option>
      </select>
    </Show>
  );
}
