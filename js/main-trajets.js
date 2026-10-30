import { initialize,trips } from "./store.js";
import {renderTrips} from './ui.js'


initialize(); 

renderTrips(trips,2,6);
