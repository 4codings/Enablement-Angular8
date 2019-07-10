import {EntryFactory, IPropertiesProvider} from '../bpmn-js';

export class CustomPropsProvider implements IPropertiesProvider {

  static $inject = ['translate', 'bpmnPropertiesProvider'];

  constructor(private translate, private bpmnPropertiesProvider) {
  }

  getTabs(element) {
    return this.bpmnPropertiesProvider.getTabs(element)
      .concat(
        {
            id : 'enableTab',
            label : this.translate('Enable'),
            groups: [
                {
                    id: 'enable',
                    label: this.translate('Enable'),
                    entries: [
                      EntryFactory.selectBox({
                        id: 'executableTypes',
                        label: this.translate('Executable Types'),
                        modelProperty: 'executableTypes',
                        selectOptions : [ 
                            { name: 'name1', value: 'value1' },
                            { name: 'name2', value: 'value2' }
                        ]
                      }),
                      EntryFactory.textBox({
                        id: 'executable',
                        label: this.translate('Executables'),
                        modelProperty: 'executable'
                      }), 
                      EntryFactory.textField({
                        id: 'executableInput',
                        label: this.translate('Executable Input'),
                        modelProperty: 'executableInput'
                      }), 
                      EntryFactory.textField({
                        id: 'executableOutput',
                        label: this.translate('Executable Output'),
                        modelProperty: 'executableOutput',
                        disabled: function(group, element){
                            return true;
                        }
                      }), 
                      EntryFactory.textField({
                        id: 'executableDescription',
                        label: this.translate('Executable Description'),
                        modelProperty: 'executableDescription',
                        disabled: function(group, element){
                            return true;
                        }
                      }), 
                      EntryFactory.textField({
                        id: 'platform',
                        label: this.translate('Platform'),
                        modelProperty: 'platform',
                        disabled: function(group, element){
                            return true;
                        }
                      }), 
                    ]              
                }
            ]
        },

        {
        id: 'propertiesTab',
        label: this.translate('Properties'),
        groups: [
          {
            id: 'properties',
            label: this.translate('Properties'),
            entries: [
              EntryFactory.checkbox({
                id: 'displayOutput',
                label: this.translate('  Display Output'),
                modelProperty: 'displayOutput'
              }),
              EntryFactory.checkbox({
                id: 'summaryOutput',
                label: this.translate('  Summary Output'),
                modelProperty: 'summaryOutput'
              }),
              EntryFactory.checkbox({
                id: 'serviceActive',
                label: this.translate('  Service Active'),
                modelProperty: 'serviceActive'
              }),
            ]
          }
        ]
      }

    );
  }
}