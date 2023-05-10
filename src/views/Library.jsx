import { Home } from './Home';

import home_icon from '../static/images/home_icon.svg';
import folder_icon from '../static/images/folder_icon.svg';
import filter_icon from '../static/images/filter_icon.png';

export const Library = () => {
    return (
        <div>
            <div className='app-header'>
                <img src={folder_icon} className='lib-img' />
                <h3 className='lib-desc'> Library </h3>
                <a href='/' className='home-img'>
                    <img src={home_icon}/>     
                </a>
                <h3> Welcome in your meal library! </h3>
            </div>
            
            <div className='app-body'>
                <p> This is the app body. </p>
                <img src={filter_icon} className='filter-img' />
                <p>Filter</p>
                <div className='filter-options'>
                    <button> Day </button>
                    <button> Week </button>
                    <button> Month </button>
                    <button> From: To: </button>
                    <button> Breakfast </button>
                    <button> Lunch </button>
                    <button> Dinner </button>
                    <button> Snack </button>
                </div>
                <div className='uploads'>
                <h3> images </h3>
                </div>

            </div>
        
        </div>
    );
}