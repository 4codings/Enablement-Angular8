import { IPalette, IPaletteProvider } from '../bpmn-js';

export class CustomPaletteProvider implements IPaletteProvider {

  static $inject = ['palette', 'originalPaletteProvider', 'elementFactory'];

  private readonly elementFactory: any;

  constructor(private palette: IPalette, private originalPaletteProvider: IPaletteProvider, elementFactory) {
    palette.registerProvider(this);
    this.elementFactory = elementFactory;
  }

  getPaletteEntries() {
    return {
      save: {
        group: 'tools',
        className: ['fa-save', 'fa'],
        title: 'TEST',
        action: {
          click: () => console.log('TEST Action clicked! Elementfactory: ', this.elementFactory)
        }
      }
    };
  }
}
