import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Modeler, PropertiesPanelModule, InjectionNames, OriginalPropertiesProvider, OriginalPaletteProvider } from './bpmn-js';
import { CustomPropsProvider } from './props-provider/custom-props-provider';
import { CustomPaletteProvider } from './props-provider/custom-palette-provider';

@Component({
  selector: 'app-process-design',
  templateUrl: './process-design.component.html',
  styleUrls: ['./process-design.component.scss']
})
export class ProcessDesignComponent implements OnInit, OnDestroy {

  private modeler: any;

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.modeler = new Modeler({
      container: '#canvas',
      width: '100%',
      height: '600px',
      additionalModules: [
        PropertiesPanelModule,
        { [InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]] },
        { [InjectionNames.propertiesProvider]: ['type', CustomPropsProvider] },
        { [InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider] },
        { [InjectionNames.paletteProvider]: ['type', CustomPaletteProvider] },
      ],
      propertiesPanel: {
        parent: '#properties'
      },
      moddleExtension: {
        custom: {
          name: 'customModdle',
          prefix: 'custom',
          xml: {
            tagAlias: 'lowerCase'
          },
          associations: [],
          types: [
            {
              'name': 'ExtUserTask',
              'extends': [
                'bpmn:UserTask'
              ],
              'properties': [
                {
                  'name': 'worklist',
                  'isAttr': true,
                  'type': 'String'
                }
              ]
            },
          ]
        }
      }
    });
    this.httpClient.get('/assets/bpmn/newDiagram.bpmn', {
      headers: { observe: 'response' }, responseType: 'text'
    }).subscribe(
      (x: any) => {
        this.modeler.importXML(x, this.handleError);
      },
      this.handleError
    );
  }

  ngOnDestroy() {
    if (this.modeler) {
      this.modeler.destroy();
    }
  }

  handleError(err: any) {
    if (err) {
      console.error(err);
    }
  }

}
