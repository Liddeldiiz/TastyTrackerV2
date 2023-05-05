import { Home } from './Home';

export const Library = () => {
    return (
        <div>
            <div className='app-header'>
                <h3 className='lib-img'> Library img </h3>
                <h3 className='lib-desc'> Library </h3>
                <a href='/' className='home-img'> Home symbol </a>
                <h3> Welcome in your meal library! </h3>
            </div>
            
            <div className='app-body'>
                <p> This is the app body. </p>
                <p className='filter-img'>Filter img</p>
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