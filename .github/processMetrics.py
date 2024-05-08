import pandas as pd
import json

from processUnderstand import *
from processSimian import *
from processDependencies import *

METRICS_FILE = "metrics.csv"
SIMIAN_FILE = "simian-out.txt"
DEPENDENCIES_FILE = "matrix.csv"
CONFIG_FILE = ".github/metrics_config.json"

# Colors
AQUA = '\033[94;1m'
TABLE_COL = ('\033[97;4m', '\033[37;4;2m')
END_COL = '\033[0m'

def percentage_to_rank(percentage: float) -> int:
    if percentage <= 0.03:
        return 2
    if percentage <= 0.05:
        return 1
    if percentage <= 0.10:
        return 0
    if percentage <= 0.20:
        return -1
    return -2

def compute_ranks(percentages: dict[str, float], config: dict[str, dict]) -> dict[str, float]:
    ranks = dict()

    for key, percentage in percentages.items():
        attrs = config[key]['attr']

        for attr in attrs:
            if attr not in ranks:
                ranks[attr] = list()
            
            ranks[attr].append(percentage_to_rank(percentage))

    for attr in ranks:
        ranks[attr] = sum(ranks[attr]) / len(ranks[attr])
    
    return ranks

def compute_grade(ranks: dict[str, float]) -> float:
    return (sum(ranks.values()) + 10) / 2

def nice_print(dictionary):
    MAXLEN = 30

    i = 0
    for key, val in dictionary.items():
        spaces = ' ' * max(0, MAXLEN - len(key))
        print(TABLE_COL[i % 2], key, spaces, val, END_COL)
        i += 1


def main():
    df = pd.read_csv(METRICS_FILE)
    categories = {c:df.loc[df.Kind == c].dropna(axis=1) for c in df.Kind.unique()}

    with open(CONFIG_FILE, 'r') as f:
        config = json.load(f)
        config_understand = config['understand']
        config_combined = {**config_understand, **config['simian'], **config['dependencies']}

    with open(SIMIAN_FILE, 'r') as f:
        duplications, total_lines, num_files = parse_output(f)
        print("Duplications: ", duplications, "\tTotal lines: ", total_lines, "\tNumber of files: ", num_files)

    with open(DEPENDENCIES_FILE, 'r') as f:
        matrix = process_file(f)

    percentages_understand = compute_percentages_understand(categories, config_understand)
    percentages_simian = compute_percentages_simian(duplications, total_lines)
    percentages_dependencies = compute_percentages_dependencies(matrix, num_files)

    percentages = {**percentages_understand, **percentages_simian, **percentages_dependencies}
    ranks = compute_ranks(percentages, config_combined)
    grade = compute_grade(ranks)

    print(f"{AQUA}Threshold violation percentages{END_COL}")
    nice_print(percentages)
    print(f"{AQUA}Ranks{END_COL}")
    nice_print(ranks)
    print(f"{AQUA}Grade:{END_COL} ", grade)
    
if __name__ == "__main__":
    main()