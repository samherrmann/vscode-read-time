import * as vscode from 'vscode';
import { Sections, Settings, extSuffix } from './models';
import { Logger } from './logging';

const { workspace } = vscode;

export function readConfiguration<T>(
  setting: Settings,
  defaultValue?: T | undefined
) {
  const value: T | undefined = workspace
    .getConfiguration(Sections.userReadTimeSection)
    .get<T | undefined>(setting, defaultValue);
  return value as T;
}

export function getEnabledSetting() {
  let foo = readConfiguration<boolean>(Settings.Enabled);
  return foo;
}

export function getEstimationDelaySetting() {
  return readConfiguration<boolean>(Settings.EstimationDelay);
}

export async function updateEnabledSetting(value: boolean) {
  return await updateGlobalConfiguration(Settings.Enabled, value);
}

export async function updateEstimationDelaySetting(value: number) {
  return await updateGlobalConfiguration(Settings.EstimationDelay, value);
}

export async function updateGlobalConfiguration<T>(
  setting: Settings,
  value?: T | undefined
) {
  let config = vscode.workspace.getConfiguration();
  const section = `${extSuffix}.${setting}`;
  Logger.info('Updating the user settings with the following changes:');
  Logger.info(`${section} = ${value}`, true);
  return await config.update(section, value, vscode.ConfigurationTarget.Global);
}
