import json # import the module of json
import sys # this module is used to get the params from cmd
import time
import RPi.GPIO as gpio

def gpio_setmode_BCM():
    gpio.setmode(gpio.BCM)

def gpio_setpin_out(pin):
    gpio.setup(pin, gpio.OUT)

def power_action(pin, opt):

    if opt == "on":
        gpio.output(pin, gpio.LOW)
    
    elif opt == "off":
        gpio.output(pin, gpio.HIGH)

    else: # reset
        # first power off
        gpio.output(pin, gpio.HIGH)

        #sleep 3 seconds for power off
        time.sleep(3)

        # then power on
        gpio.output(pin, gpio.LOW)


def gen_result(board, chnl, opt, status):
    result_json = {"board":board, "chnl":chnl, "option":opt, "status":status}
    result_str = json.dumps(result_json,sort_keys=True)

    return result_str

def main():

    board = sys.argv[1]
    chnl = sys.argv[2]
    opt = sys.argv[3]
    #print("opt is " + opt)

    status = 'success'

    evb_chnl_pin = 17
    rdb2_chnl_pin = 27
    reserved_chnl3_pin = 22
    reserved_chnl4_pin = 23

    chnl_pin = 0

    if int(chnl) > 4 or int(chnl) < 1:
        status = "Invalid chnl index!"
        result = gen_result(board, chnl, opt, status)
        print(result)
        return

    if board == "evb":
        chnl_pin = evb_chnl_pin
    elif board == "rdb2":
        chnl_pin = rdb2_chnl_pin
    else:
        status = "Invalid board type!"
        result = gen_result(board, chnl, opt, status)
        print(result)
        return

    gpio_setmode_BCM()
    gpio_setpin_out(chnl_pin)

    power_action(chnl_pin, opt)
    
    #obj = json.loads(params) #str to obj
    result = gen_result(board, chnl, opt, status)
    print(result)

main()
