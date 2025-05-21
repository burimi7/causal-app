import React, { useEffect, useState } from 'react';
import './MetricInput.css';
import { Autocomplete, Button, Chip, Menu, MenuItem, TextField } from '@mui/material';
import axios from 'axios';


interface TimeSpanOption {
    value: string;
    label: string;
}

interface FormulaOption {
    value: string;
    label: string;
}

interface Item {
    type: 'text' | 'pill' | 'pillWithDropdown',
    value: string,
    hasDropdown?: boolean,
    dropdownValue?: string
}

const API_URL = 'https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete';

const timeSpanOptions: TimeSpanOption[] = [
    { value: 'this month', label: 'this month' },
    { value: 'previous month', label: 'previous month' },
    { value: '1 year ago', label: '1 year ago' },
];

const MetricInput = async () => {
    const [valueSelected, setValueSelected] = useState('');

    const fetchAutocompleteData = async () => {
        const response = await axios.get(API_URL);
        return response.data;
    };

    const autocompleteData = await fetchAutocompleteData();


    const [allItems, setAllItems] = useState<Item[]>([

        {
            type: 'text',
            value: '12'
        },
        {
            type: 'pill',
            value: '% Churn rate'
        },
        {
            type: 'pillWithDropdown',
            value: '# Inbound leads',
            hasDropdown: true,
            dropdownValue: 'this month'
        },
        {
            type: 'text',
            value: '-'
        },
        {
            type: 'pillWithDropdown',
            value: '# Outbound messages',
            hasDropdown: true,
            dropdownValue: 'last 3 months'
        }
    ])



    const formulaOptions: Item[] = [
        {
            type: 'text',
            value: 'Current metrics: '
        },
        {
            type: 'pill',
            value: 'Revenue'
        },
        {
            type: 'pillWithDropdown',
            value: 'Growth rate',
            hasDropdown: true,
            dropdownValue: 'quarterly'
        },
        {
            type: 'pillWithDropdown',
            value: 'Previous period',
            hasDropdown: true,
            dropdownValue: 'last year'
        },
        {
            type: 'pill',
            value: '15%'
        },
        {
            type: 'pillWithDropdown',
            value: 'Customer count',
            hasDropdown: true,
            dropdownValue: 'active'
        },
        {
            type: 'text',
            value: ' across '
        },
        {
            type: 'pillWithDropdown',
            value: 'Region',
            hasDropdown: true,
            dropdownValue: 'North America'
        }
    ];

 const updatePill = (update: any) => {
    console.log('updatePill', { update });

    setAllItems(prevItems => {
        const newItems = [...prevItems]; // Create a shallow copy
        newItems[update.index] = {
            ...newItems[update.index],
            dropdownValue: update.option.value
        };
        console.log({ newItems });
        return newItems; // Return a new reference
    });
};

    return (
        <div className='container'>
            <label>=</label>
            {allItems.map((i: Item, index: number) => {
                return i.type === 'text' ? (
                    <label key={index}>{i.value}</label>
                ) : i.type === 'pill' ? (
                    <Pill item={i} index={index} key={index} updatePill={updatePill} />
                ) : (
                    <Pill item={i} index={index} key={index} updatePill={updatePill} />
                );
            })}
            {/* <input type='text' placeholder='Type the expression' /> */}
            <Autocomplete
                inputValue={valueSelected}
                id="free-solo-demo"
                freeSolo
                options={formulaOptions.map((option) => option.value)}
                renderInput={(params) => <TextField {...params} />}
                onKeyDown={(e: any) => {
                    console.log(e.code, { e })
                    if (e.code === 'Backspace' && (e.target as HTMLInputElement).value.length === 0) {
                        setAllItems(allItems.slice(0, -1));
                        setValueSelected('')
                    }
                }}
                onChange={(event, newValue) => {
                    console.log({ newValue })
                    if (typeof newValue === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        const item = formulaOptions.find((a: Item) => a.value === newValue) || null
                        if (item !== null) {
                            setAllItems([...allItems, item]);
                        } else if (newValue.length > 0) {
                            setAllItems([...allItems, { type: "text", value: newValue }]);

                        }

                        setTimeout(() => {
                            setValueSelected('')
                        });
                    }
                }}

                onInputChange={(event, newInputValue) => {
                    setValueSelected(newInputValue);
                }}
            />
        </div>
    )
};

const Pill = (props: any) => {


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (e: any = undefined) => {
        setAnchorEl(null);
    };

    return (

        <div className='nooo'>
            <Chip label={props.item.value} className='chip' />
            {props.item.type === 'pillWithDropdown' && (
                <>
                    <button
                        className='the-button'
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        {props.item.dropdownValue}
                    </button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {timeSpanOptions.length > 0 &&
                            timeSpanOptions.map((option: TimeSpanOption, index: number) => (
                                <MenuItem
                                    onClick={() => {
                                       props.updatePill({option,index:props.index})
                                        handleClose(option);
                                    }}
                                    key={option.value} // Better to use option.value as key if unique
                                >
                                    {option.label} {/* Render the label property */}
                                </MenuItem>
                            ))}
                    </Menu>
                </>
            )}</div>
    );


}

export default MetricInput;