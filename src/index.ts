import App from './app';
import { Container } from 'typedi';

const appInstance = Container.get(App);
appInstance.run();
