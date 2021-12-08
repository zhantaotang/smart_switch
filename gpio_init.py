import json # import the module of json
import sys # this module is used to get the params from cmd
import time
import RPi.GPIO as gpio


def gpio_init(pin):

    gpio.setup(pin, gpio.OUT)
    gpio.output(pin, gpio.LOW)


def gen_result(status):
    result_json = {"status":status}
    result_str = json.dumps(result_json,sort_keys=True)

    return result_str

def main():

    status = 'success'

    evb_chnl_pin = 17
    rdb2_chnl_pin = 27
    reserved_chnl3_pin = 22
    reserved_chnl4_pin = 23

    pin_list = [evb_chnl_pin, rdb2_chnl_pin, reserved_chnl3_pin, reserved_chnl4_pin]
    
    #using BCM pin mode
    gpio.setmode(gpio.BCM)
    for pin in pin_list:
        gpio_init(pin)
    
    result = gen_result(status)
    print(result)

main()
