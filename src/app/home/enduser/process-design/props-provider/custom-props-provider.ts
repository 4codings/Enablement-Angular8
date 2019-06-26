import { EntryFactory, IPropertiesProvider } from '../bpmn-js';

export class CustomPropsProvider implements IPropertiesProvider {

  static $inject = ['translate', 'bpmnPropertiesProvider'];

  constructor(private translate, private bpmnPropertiesProvider) {
  }

  getTabs(element) {
    return this.bpmnPropertiesProvider.getTabs(element);
  }
}
