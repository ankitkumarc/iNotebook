import Notes from './Notes';

const Home = (props) => {
    const { showAlert, mode, toggle } = props;
    return (
        <div>
            <Notes showAlert={showAlert} mode={mode} toggle={toggle} />
        </div>
    );
}

export default Home;
