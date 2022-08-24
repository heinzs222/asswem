import "./FormInput.css";

const FormInput = (props) => {
    return (
        <div className="formInput">
            <label></label>
            <input name={props.name} placeholder={props.placeholder} />
        </div>
    );
};

export default FormInput;
