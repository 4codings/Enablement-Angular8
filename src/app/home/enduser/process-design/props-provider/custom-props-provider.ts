import { EntryFactory, IPropertiesProvider } from '../bpmn-js';

export class CustomPropsProvider implements IPropertiesProvider {

  static $inject = ['translate', 'bpmnPropertiesProvider'];

  constructor(private translate, private bpmnPropertiesProvider) {
  }

  getTabs(element) {
    return this.bpmnPropertiesProvider.getTabs(element)
      .concat({
        id: 'custom',
        label: this.translate('Custom'),
        groups: [
          {
            id: 'customText',
            label: this.translate('customText'),
            entries: [
              EntryFactory.textBox({
                id: 'custom',
                label: this.translate('customText'),
                modelProperty: 'customText'
              }),
            ]
          }
        ]
      });
  }
}
